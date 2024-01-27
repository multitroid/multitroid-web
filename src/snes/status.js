import { readFromSnes } from './read'
import { RTL } from './asm'
import { ingameStateValues } from './gamestate'
import { DisconnectedFromServer, DisconnectedFromSnes, NotIngameAnymore } from '../util/error'

const timer = ms => new Promise(res => setTimeout(res, ms))

const readyCheck = async (webSockets) => {
  const commandLocation = webSockets.snesWebsocket.game.code.commandLocation
  const data = await readFromSnes(
    webSockets,
    [[commandLocation, 1]]
  )
  return data[0][0] === RTL()[0]
}

export const waitForSnes = async (webSockets) => {
  let ready = false
  while (!ready) {
    if (webSockets.snesWebsocket.readyState !== webSockets.snesWebsocket.OPEN) {
      throw new DisconnectedFromSnes()
    }
    if (webSockets.serverWebsocket.readyState !== webSockets.serverWebsocket.OPEN) {
      throw new DisconnectedFromServer()
    }
    const currentPlayerState = await readPlayerStateFromSnes(webSockets)
    if (!ingameStateValues.includes(currentPlayerState)) {
      throw new NotIngameAnymore(currentPlayerState)
    }
    ready = await readyCheck(webSockets)
    if (!ready) {
      await timer(25)
    }
  }
}

export const readPlayerStateFromSnes = async (webSockets) => (await readFromSnes(webSockets, [[0x7E0998, 1]]))[0][0]
