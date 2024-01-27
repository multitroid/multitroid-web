export const gameStates = {
  NintendoLogo: { value: 0x00, ingame: false, display: 'Nintendo logo' },
  TitleScreen: { value: 0x01, ingame: false, display: 'Title screen' },
  OptionMode: { value: 0x02, ingame: false, display: 'Option mode' },
  Unknown1: { value: 0x03, ingame: false, display: 'Unknown' },
  Menu: { value: 0x04, ingame: false, display: 'Menus' },
  LoadArea: { value: 0x05, ingame: false, display: 'Load game area display' },
  LoadingGame: { value: 0x06, ingame: true, display: 'Loading game' },
  ElectrifiedInSaveCapsule: { value: 0x07, ingame: true, display: 'Playing' },
  NormalGamePlay: { value: 0x08, ingame: true, display: 'Playing' },
  BeginDoorTransition: { value: 0x09, ingame: true, display: 'Playing' },
  DoorTransition1: { value: 0x0A, ingame: true, display: 'Playing' },
  DoorTransition2: { value: 0x0B, ingame: true, display: 'Playing' },
  Pausing1: { value: 0x0C, ingame: true, display: 'Paused' },
  Pausing2: { value: 0x0D, ingame: true, display: 'Paused' },
  Pausing3: { value: 0x0E, ingame: true, display: 'Paused' },
  Paused: { value: 0x0F, ingame: true, display: 'Paused' },
  Unpausing1: { value: 0x10, ingame: true, display: 'Paused' },
  Unpausing2: { value: 0x11, ingame: true, display: 'Paused' },
  Unpausing3: { value: 0x12, ingame: true, display: 'Paused' },
  Dying1: { value: 0x13, ingame: false, display: 'Dying' },
  Dying2: { value: 0x14, ingame: false, display: 'Dying' },
  Dying3: { value: 0x15, ingame: false, display: 'Dying' },
  Dying4: { value: 0x16, ingame: false, display: 'Dying' },
  Dying5: { value: 0x17, ingame: false, display: 'Dying' },
  Dying6: { value: 0x18, ingame: false, display: 'Dying' },
  Dying7: { value: 0x19, ingame: false, display: 'Dying' },
  Dead: { value: 0x1A, ingame: false, display: 'Dead' },
  RefillingReserves: { value: 0x1B, ingame: true, display: 'Refilling reserves' },
  Unknown2: { value: 0x1C, ingame: false, display: 'Unknown' },
  DebugMode: { value: 0x1D, ingame: false, display: 'Debug Mode' },
  CutsceneEnding: { value: 0x1E, ingame: false, display: 'Intro Cutscenes' },
  GameStarting: { value: 0x1F, ingame: true, display: 'Game Starting' },
  CeresExit1: { value: 0x20, ingame: true, display: 'Ceres exit' },
  CeresExit2: { value: 0x21, ingame: true, display: 'Ceres blackout' },
  CeresExit3: { value: 0x22, ingame: true, display: 'Ceres escape' },
  TimerUp: { value: 0x23, ingame: false, display: 'Time\'s up!' },
  CeresExplodes: { value: 0x24, ingame: true, display: 'Ceres exploding' },
  DyingInCeres: { value: 0x25, ingame: false, display: 'Dying in ceres' },
  SamusEscapesFromZebes: { value: 0x26, ingame: true, display: 'Escaping from Zebes' },
  Credits: { value: 0x27, ingame: true, display: 'Credits' },
  TransitionToDemo1: { value: 0x28, ingame: false, display: 'Intro demos' },
  TransitionToDemo2: { value: 0x29, ingame: false, display: 'Intro demos' },
  IntroDemos: { value: 0x2A, ingame: false, display: 'Intro demos' },
  TransitionFromDemo1: { value: 0x2B, ingame: false, display: 'Intro demos' },
  TransitionFromDemo2: { value: 0x2C, ingame: false, display: 'Intro demos' },
  Unknown: { value: 0xFF, ingame: false, display: 'Unknown' }
}

export const ingameStateValues = Object.values(gameStates)
  .filter(gs => gs.ingame)
  .map(gs => gs.value)

export const notIngameStateValues = Object.values(gameStates)
  .filter(gs => !gs.ingame)
  .map(gs => gs.value)

export const gameStateNameFromValue = (value) => {
  const stateEntry = Object.entries(gameStates).find(entry => entry[1].value === value)
  if (!stateEntry) {
    return 'Unknown'
  }
  return stateEntry[1].display
}

export const ingameFromValue = (value) => {
  const stateEntry = Object.entries(gameStates).find(entry => entry[1].value === value)
  return stateEntry?.[1]?.ingame || false
}
