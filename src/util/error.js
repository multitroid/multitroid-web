import { gameStateNameFromValue } from '../snes/gamestate'

export class SnesReadTimeout extends Error {
  constructor() {
    super('Timed out while waiting for SNES to respond')
  }
}

export class NotIngameAnymore extends Error {
  constructor(newGameState) {
    super(`Not ingame anymore. GameState: ${gameStateNameFromValue(newGameState)} (${newGameState})`)
  }
}

export class DisconnectedFromSnes extends Error {
  constructor() {
    super('Disconnected from SNES')
  }
}

export class DisconnectedFromServer extends Error {
  constructor() {
    super('Disconnected from server')
  }
}
