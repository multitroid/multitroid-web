import { writeCommands } from './write'
import {
  readConsumableValueFromOptimized,
  readFromSnes,
  readEverythingFromSnes,
  readRangeFromOptimized,
  readStatusValueFromOptimized,
} from './read'
import { LDA, ORAValue, STA } from './asm'
import { notIngameStateValues } from './gamestate'
import { sleep } from '../util/sleep'
import { DisconnectedFromServer, DisconnectedFromSnes, NotIngameAnymore } from '../util/error'
import { readPlayerStateFromSnes } from './status'

const mainLoopMinTime = 250

export const mainLoopUntilFalse = async (webSockets) => {
  let runAgain = true
  while (runAgain) {
    const loopStart = new Date().getTime()
    runAgain = await mainLoop(webSockets)
    if (runAgain) {
      const timeTaken = (new Date().getTime()) - loopStart
      if (timeTaken < mainLoopMinTime) {
        await sleep(mainLoopMinTime - timeTaken)
      }
    }
  }
}

export const mainLoop = async (webSockets) => {
  if (webSockets.snesWebsocket.readyState !== webSockets.snesWebsocket.OPEN) {
    throw new DisconnectedFromSnes()
  }
  if (webSockets.serverWebsocket.readyState !== webSockets.serverWebsocket.OPEN) {
    throw new DisconnectedFromServer()
  }

  const firstReadPlayerState = await readPlayerStateFromSnes(webSockets)
  const data = await readEverythingFromSnes(webSockets)
  const secondReadPlayerState = await readPlayerStateFromSnes(webSockets)

  if (firstReadPlayerState !== secondReadPlayerState) {
    await sleep(250)
    return true
  }

  const ingame = !notIngameStateValues.includes(secondReadPlayerState)

  if (webSockets.snesWebsocket.reset && ingame) {
    webSockets.snesWebsocket.reset = false
    webSockets.snesWebsocket.writeQueue = []
    if (webSockets.snesWebsocket.resetAsm) {
      const cmds = [webSockets.snesWebsocket.resetAsm]
      webSockets.snesWebsocket.resetAsm = undefined
      await writeCommands(webSockets, cmds)
    }
  }

  webSockets.snesWebsocket.game.statuses
    .forEach(status => {
      readStatusAndSendUpdateToServer(webSockets, status, data)
    })

  if (!ingame) {
    throw new NotIngameAnymore(secondReadPlayerState)
  }

  webSockets.snesWebsocket.game.rangeDescriptors
    .forEach(rangeDescriptor => {
      readRangeDescriptorAndSendUpdateToServer(rangeDescriptor, webSockets, data)
    })

  webSockets.snesWebsocket.game.consumables
    .forEach(consumable => {
      readConsumableAndSendUpdateToServer(consumable, webSockets, data)
    })

  const currentAreaCommands = await handleCurrentArea(webSockets, data)

  const commandCreators = []
  while (webSockets.snesWebsocket.writeQueue.length > 0) {
    commandCreators.push(webSockets.snesWebsocket.writeQueue.shift())
  }

  const commands = commandCreators
    .map(commandCreator => commandCreator(webSockets.snesWebsocket))
    .reduce((acc, cur) => acc.concat(cur), [])

  const combinedCommands = commands.concat(currentAreaCommands)

  await writeCommands(webSockets, combinedCommands)

  return true
}

const readRangeDescriptorAndSendUpdateToServer = (rangeDescriptor, webSockets, data) => {
  const newData = readRangeFromOptimized(webSockets, data, rangeDescriptor.startAddress, rangeDescriptor.length)

  if (rangeDescriptor.onlySyncDescribedBits) {
    diffAndSendDescribedBitUpdates(newData, rangeDescriptor, webSockets.serverWebsocket)
  } else {
    diffAndSendAllBitUpdates(newData, rangeDescriptor, webSockets.serverWebsocket)
  }
}

const diffAndSendDescribedBitUpdates = (newData, rangeDescriptor, serverWebsocket) => {
  newData.forEach((newByte, i) => {
    const oldByte = rangeDescriptor.data[i]
    if (oldByte !== newByte) {
      rangeDescriptor.bitDescriptors.forEach(bitDescriptor => {
        if (bitDescriptor.index === i) {
          const mask = 0x00 | bitDescriptor.mask
          const compareResult = (newByte | oldByte) & mask
          if (compareResult !== (oldByte & mask)) {
            const bitUpdate = {
              type: 'BitUpdate',
              name: rangeDescriptor.name,
              index: bitDescriptor.index,
              mask: bitDescriptor.mask,
              value: newByte & mask
            }
            const message = JSON.stringify(bitUpdate)
            serverWebsocket.send(message)
          }
        }
      })
      rangeDescriptor.data[i] = newByte
    }
  })
}

const diffAndSendAllBitUpdates = (newData, rangeDescriptor, serverWebsocket) => {
  newData.forEach((newByte, byteIndex) => {
    const oldByte = rangeDescriptor.data[byteIndex]
    if (oldByte !== newByte) {
      for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
        const mask = newByte & (1 << bitIndex)
        const compareResult = (newByte | oldByte) & mask
        if (compareResult !== (oldByte & mask)) {
          const bitUpdate = {
            type: 'BitUpdate',
            name: rangeDescriptor.name,
            index: byteIndex,
            mask: mask,
            value: newByte & mask
          }
          const message = JSON.stringify(bitUpdate)
          serverWebsocket.send(message)
        }
      }
      rangeDescriptor.data[byteIndex] = newByte
    }
  })
}

const readConsumableAndSendUpdateToServer = (consumable, webSockets, data) => {
  const newValue = readConsumableValueFromOptimized(webSockets, consumable, data)
  const oldValue = consumable.value ? consumable.value : 0
  consumable.value = newValue
  consumable.oldValue = oldValue
  if (oldValue !== newValue) {
    const consumableUpdate = {
      type: 'ConsumableUpdate',
      name: consumable.name,
      value: newValue,
      diff: newValue - oldValue,
      force: false
    }
    const message = JSON.stringify(consumableUpdate)
    webSockets.serverWebsocket.send(message)
  }
}

const readStatusAndSendUpdateToServer = (webSockets, status, data) => {
  const newValue = readStatusValueFromOptimized(webSockets, status, data)
  const oldValue = status.value
  status.value = newValue
  if (oldValue !== newValue) {
    const statusUpdate = {
      type: 'StatusUpdate',
      name: status.name,
      value: newValue
    }
    const message = JSON.stringify(statusUpdate)
    webSockets.serverWebsocket.send(message)
  }
}

const handleCurrentArea = async (webSockets, data) => {
  const currentArea = (await readFromSnes(webSockets, [[0x7E079F, 1]]))[0][0]

  const currentAreaPreviousLoop = readRangeFromOptimized(webSockets, data, 0x7E079F, 1)[0]

  if (currentArea !== currentAreaPreviousLoop) {
    return []
  }

  const currentAreaRangeDescriptor = webSockets.snesWebsocket.game.rangeDescriptors
    .find(rd => rd.area === -1)
  if (!currentAreaRangeDescriptor) {
    return []
  }

  const areaRangeDescriptor = webSockets.snesWebsocket.game.rangeDescriptors
    .find(rd => rd.area === currentAreaPreviousLoop)

  const currentAreaData = currentAreaRangeDescriptor.data
  const areaData = areaRangeDescriptor.data

  const commands = []

  for (let i = 0; i < currentAreaData.length; i++) {
    const combinedByte = (currentAreaData[i] | areaData[i])
    if (currentAreaData[i] !== combinedByte) {
      commands.push([
        LDA(currentAreaRangeDescriptor.startAddress + i),
        ORAValue(combinedByte),
        STA(currentAreaRangeDescriptor.startAddress + i)
      ])
    }
    if (areaData[i] !== combinedByte) {
      commands.push([
        LDA(areaRangeDescriptor.startAddress + i),
        ORAValue(combinedByte),
        STA(areaRangeDescriptor.startAddress + i)
      ])
    }
  }

  return commands
}
