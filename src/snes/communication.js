import {
  createOptimizedReads,
  readConsumablesFromSnesData,
  readEverythingFromSnes,
  readFromSnes,
  readRangesFromSnesData,
  readStatusesFromSnesData
} from './read'
import {
  handleBitUpdate,
  handleChat,
  handleCheat,
  handleConsumableUpdate,
  handleExecuteAsm,
  handleRangeUpdate,
  handleWrite,
  writeInitialServerDataToSnes,
  writeToSnes
} from './write'
import { mainLoopUntilFalse } from './mainloop'
import { ingameStateValues } from './gamestate.js'
import { PHP, RTL } from './asm'
import { sleep } from '../util/sleep'
import { MESSAGE_TYPE } from './worker'
import { DisconnectedFromServer, DisconnectedFromSnes, NotIngameAnymore, SnesReadTimeout } from '../util/error'
import { readPlayerStateFromSnes } from './status'


export const onServerMessage = async (messageString, webSockets, disconnect) => {
  const message = JSON.parse(messageString)

  switch (message.type) {
    case 'SessionDetails': {
      webSockets.snesWebsocket.originalSessionDetailsString = messageString
      await init(webSockets, disconnect)
      break
    }

    case 'InitialGameState': {
      grabDataFromServerStateAndCalculateDiff(webSockets, message)

      try {
        await writeInitialServerDataToSnes(webSockets)
        postMessage({
          type: MESSAGE_TYPE.STATUS,
          data: {
            sync: 3
          }
        })
        webSockets.snesWebsocket.reset = false
        webSockets.snesWebsocket.writeQueue = []
        webSockets.snesWebsocket.canWriteConsumables = false
        await mainLoopUntilFalse(webSockets)
      } catch (err) {
        if (err instanceof NotIngameAnymore) {
          console.log(err.message)
          await init(webSockets, disconnect)
          return
        } else {
          disconnect()
          if (!webSockets.snesWebsocket.closeRequested) {
            postMessage({
              type: MESSAGE_TYPE.ALERT,
              data: err.message + '\n' + err.stack
            })
          }
        }
      }

      break
    }

    case 'ConsumableUpdate': {
      handleConsumableUpdate(webSockets, message)
      break
    }

    case 'RangeUpdate': {
      handleRangeUpdate(webSockets, message)
      break
    }

    case 'BitUpdate': {
      handleBitUpdate(webSockets, message)
      break
    }

    case 'ExecuteAsm': {
      handleExecuteAsm(webSockets, message.asm)
      break
    }

    case 'Write': {
      handleWrite(webSockets, message.addresses, message.values, message.offset)
      break
    }

    case 'ClientList': {
      break
    }

    case 'ResetGameState': {
      webSockets.snesWebsocket.reset = true
      webSockets.snesWebsocket.resetAsm = message.asm
      break
    }

    case 'StatusUpdate': {
      break
    }

    case 'Chat': {
      handleChat(webSockets, message)
      break
    }

    case 'Cheat': {
      handleCheat(webSockets)
      break
    }

    case 'Pong': {
      break
    }

    case 'Bingo': {
      break
    }

    case 'BingoRace': {
      break
    }

    case 'TextToSpeech': {
      break
    }

    default:
      console.log(webSockets.snesWebsocket.name, 'unknown message', message)
      break
  }
}

const init = async (webSockets, disconnect) => {
  webSockets.snesWebsocket.writeQueue = []

  postMessage({
    type: MESSAGE_TYPE.STATUS,
    data: {
      sync: 0,
    }
  })

  const sessionDetails = JSON.parse(webSockets.snesWebsocket.originalSessionDetailsString)
  webSockets.snesWebsocket.game = sessionDetails.game
  webSockets.snesWebsocket.sessionDetails = {
    ...sessionDetails,
    optimizedReads: createOptimizedReads(webSockets.snesWebsocket.game),
    game: undefined
  }

  const patched = await writePatch(webSockets)
  if (!patched) {
    disconnect()
    postMessage({
      type: MESSAGE_TYPE.ALERT,
      data: 'Could not write patch to SNES. Disconnecting.'
    })
    return
  }

  postMessage({
    type: MESSAGE_TYPE.STATUS,
    data: {
      sync: 1,
    }
  })

  try {
    await readAndSendInitialDataWhenIngame(webSockets)
  } catch (err) {
    console.error(err)
    if (err instanceof SnesReadTimeout || err instanceof DisconnectedFromSnes || err instanceof DisconnectedFromServer) {
      postMessage({
        type: MESSAGE_TYPE.ALERT,
        data: err.message
      })
    }
    disconnect()
  }
}

export const writePatch = async (webSockets) => {
  let success = false
  try {
    success = await writePatchToSnes(webSockets)
  } catch (err) {
    console.error(err)
  }
  return success
}

const writePatchToSnes = async (webSockets) => {
  const code = webSockets.snesWebsocket.game.code

  if (webSockets.snesWebsocket.id === 'EMU RETROARCH') {
    writeToSnes(webSockets, code.commandLocation, [0xEA, 0x6B])
    writeToSnes(webSockets, code.mainCodeLocation, code.mainCode)
    return true
  }

  const wasAlreadyPatched = await readPatchAppliedSuccessfully(webSockets)
  if (wasAlreadyPatched) {
    return true
  } else {
    writeToSnes(webSockets, code.commandLocation, [0xEA, 0x6B])
    writeToSnes(webSockets, code.mainCodeLocation, code.mainCode)
    writeToSnes(webSockets, 0x809B44, RTL())
    writeToSnes(webSockets, code.hijackLocation, code.hijackCode)
    writeToSnes(webSockets, 0x809B44, PHP())
    return await readPatchAppliedSuccessfully(webSockets, code)
  }
}

const readPatchAppliedSuccessfully = async (webSockets) => {
  const code = webSockets.snesWebsocket.game.code
  const data = await readFromSnes(
    webSockets,
    [
      [code.hijackLocation, code.hijackCode.length],
      [code.mainCodeLocation, code.mainCode.length]
    ]
  )
  let patchSuccess = true
  data[0].forEach((byteFromSnes, i) => {
    if (byteFromSnes !== code.hijackCode[i]) {
      patchSuccess = false
    }
  })
  data[1].forEach((byteFromSnes, i) => {
    if (byteFromSnes !== code.mainCode[i]) {
      patchSuccess = false
    }
  })

  return patchSuccess
}

const readAndSendInitialDataWhenIngame = async (webSockets) => {
  let data
  let ingame = false

  while (!ingame) {
    const firstReadPlayerState = await readPlayerStateFromSnes(webSockets)
    data = await readEverythingFromSnes(webSockets)
    const secondReadPlayerState = await readPlayerStateFromSnes(webSockets)

    if (firstReadPlayerState !== secondReadPlayerState) {
      await sleep(250)
      continue
    }

    const statuses = readStatusesFromSnesData(webSockets, data)

    const statusUpdates = statuses.map(status => {
      return {
        type: 'StatusUpdate',
        name: status.name,
        value: status.value
      }
    })

    const updatedStatuses = statuses.filter(status => status.changed)

    updatedStatuses.forEach(updatedStatus => {
      if (webSockets.serverWebsocket.readyState !== webSockets.serverWebsocket.OPEN) {
        throw new DisconnectedFromServer()
      }
      const statusUpdate = {
        type: 'StatusUpdate',
        name: updatedStatus.name,
        value: updatedStatus.value
      }
      const message = JSON.stringify(statusUpdate)
      webSockets.serverWebsocket.send(message)
    })

    ingame = ingameStateValues.includes(statusUpdates.find(su => su.name === 'GameState').value)
    if (!ingame) {
      await sleep(1000)
    }
  }

  const rangeUpdates = readRangesFromSnesData(webSockets, data)
    .map(range => {
      return {
        name: range.name,
        data: range.data
      }
    })

  const consumableUpdates = readConsumablesFromSnesData(webSockets, data)
    .map(consumable => {
      return {
        name: consumable.name,
        value: consumable.value,
        diff: 0,
        isForce: true
      }
    })

  postMessage({
    type: MESSAGE_TYPE.STATUS,
    data: {
      sync: 2,
    }
  })

  sendInitialDataToServer(webSockets, rangeUpdates, consumableUpdates)
}

const sendInitialDataToServer = (webSockets, rangeUpdates, consumableUpdates) => {
  const initialGameState = {
    type: 'InitialGameState',
    consumableUpdates: consumableUpdates,
    statusUpdates: [],
    rangeUpdates: rangeUpdates
  }

  const message = JSON.stringify(initialGameState)
  webSockets.serverWebsocket.send(message)
}

const grabDataFromServerStateAndCalculateDiff = (webSockets, initialDataFromServer) => {
  initialDataFromServer.rangeUpdates.forEach(rangeFromServer => {
    const gameRangeDescriptor = webSockets.snesWebsocket.game.rangeDescriptors.find(rd => rd.name === rangeFromServer.name)
    gameRangeDescriptor.diff = rangeFromServer.data.map((serverData, x) => {
      return gameRangeDescriptor.data[x] === serverData ? 0 : 1
    })
    gameRangeDescriptor.oldData = gameRangeDescriptor.data
    gameRangeDescriptor.data = rangeFromServer.data
  })
  initialDataFromServer.consumableUpdates.forEach((consumableFromServer) => {
    const gameConsumable = webSockets.snesWebsocket.game.consumables.find(c => c.name === consumableFromServer.name)
    gameConsumable.oldValue = gameConsumable.value ? gameConsumable.value : 0
    gameConsumable.value = consumableFromServer.value
    gameConsumable.force = true
  })
}
