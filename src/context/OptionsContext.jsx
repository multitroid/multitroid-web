import { createContext } from 'use-context-selector'
import beep from '../sound/beep.mp3'

export const mapColors = [
  {
    label: 'Dark blue',
    value: 'rgb(29,37,115)'
  },
  {
    label: 'Pink',
    value: 'rgb(212,28,130)'
  },
  {
    label: 'Green',
    value: 'rgb(0,183,90)'
  },
  {
    label: 'Orange',
    value: 'rgb(255,153,51)'
  },
  {
    label: 'Light blue',
    value: 'rgb(51,153,255)'
  },
  {
    label: 'Red',
    value: 'rgb(255,0,0)'
  },
  {
    label: 'Purple',
    value: 'rgb(153,51,255)'
  },
  {
    label: 'Yellow/puke',
    value: 'rgb(204,204,0)'
  },
  {
    label: 'Gray',
    value: 'rgb(140,140,140)'
  },
  {
    label: 'Black',
    value: 'rgb(0,0,0)'
  },
]

export const mapMarkerSize = [
  {
    label: 'Small',
    value: 8
  },
  {
    label: 'Medium',
    value: 16
  },
  {
    label: 'Large',
    value: 32
  }
]

export const defaultOptions = {
  'Debug': {
    label: 'Debug',
    type: 'boolean',
    defaultValue: false
  },
  'RoutePlanner': {
    label: 'Route Planner',
    type: 'boolean',
    defaultValue: true
  },
  'BrowserSourceLinks': {
    label: 'Browser source links',
    type: 'boolean',
    defaultValue: true
  },
  'CINEMATIC_BOSS_FIGHTS': {
    label: 'Cinematic boss fights',
    type: 'boolean',
    defaultValue: true
  },
  'EQUIPMENT': {
    label: 'Equipment',
    type: 'boolean',
    defaultValue: false
  },
  'EVENT': {
    label: 'Events',
    type: 'boolean',
    defaultValue: false
  },
  'ITEM': {
    label: 'Items',
    type: 'boolean',
    defaultValue: false
  },
  'DOOR': {
    label: 'Doors',
    type: 'boolean',
    defaultValue: false
  },
  'CHAT': {
    label: 'Chat',
    type: 'boolean',
    defaultValue: false
  },
  'MAP': {
    label: 'Map',
    type: 'boolean',
    defaultValue: true
  },
  'MAP_ZOOM_SMALL': {
    label: 'Zoom map',
    type: 'boolean',
    defaultValue: false
  },
  'MAP_MARKER_PULSE': {
    label: 'Pulse map markers',
    type: 'boolean',
    defaultValue: true
  },
  'MAP_MARKER_SIZE': {
    label: 'Map marker size',
    type: 'select',
    values: mapMarkerSize,
    defaultValue: 16
  },
  'BIG_MAP': {
    label: 'Show big map',
    type: 'boolean',
    defaultValue: false
  },
  'BIG_RED_BUTTON': {
    label: 'Big red button',
    type: 'boolean',
    defaultValue: false
  },
  'MapColorUnvisited': {
    label: 'Map color - unvisited',
    type: 'select',
    values: mapColors,
    defaultValue: mapColors[0].value
  },
  'MapColorVisited': {
    label: 'Map color - visited',
    type: 'select',
    values: mapColors,
    defaultValue: mapColors[1].value
  },
  'DefaultClientName': {
    label: 'Player name',
    label2: '(so you don\'t have to type it every time)',
    type: 'input',
    defaultValue: ''
  },
  'SD2SNES_URI': {
    label: 'IP address to usb2snes software',
    type: 'input',
    defaultValue: 'localhost'
  },
  'SD2SNES_Port': {
    label: 'Port to usb2snes software',
    type: 'input',
    defaultValue: '23074'
  },
  'Disconnect_Sound': {
    label: 'Disconnect sound',
    type: 'sound',
    sound: beep,
    defaultValue: false
  },
  'TextToSpeech': {
    label: 'Text-to-speech for equipment',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE': {
    label: 'Show go-mode on tracker',
    label2: '(more options appear below)',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_REFERENCE': {
    label: 'Show go-mode reference panel',
    label2: '(more options appear below)',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_SUITLESS_MARIDIA': {
    label: 'Suitless easy',
    label2: 'Hi-Jump + Grapple + Ice',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_SUITLESS_MARIDIA_HARD': {
    label: 'Suitless hard',
    label2: 'Hi-Jump + Spring + Grapple',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_SUITLESS_MARIDIA_HARD2': {
    label: 'Suitless hard 2',
    label2: 'Hi-Jump + Spring + Ice + Space',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_BOTWOON_ICE_CLIP': {
    label: 'Ice clip',
    label2: 'Ice',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_BOTWOON_CF_CLIP': {
    label: 'CF clip',
    label2: 'CF + Gravity + Bombs',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_BOTWOON_SUITLESS_CF_CLIP': {
    label: 'Suitless CF clip',
    label2: 'CF only',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_DRAYGON_GRAVITY_JUMP': {
    label: 'Gravity jump',
    label2: 'Gravity',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_DOUBLE_SPRING_BALL_JUMP': {
    label: 'Double spring ball jump',
    label2: 'Spring',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_BLUE_SUIT_GRAPPLE_JUMP': {
    label: 'Blue suit grapple jump',
    label2: 'CF + Grapple',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_SPIKE_SUIT_SPRING_BALL': {
    label: 'Spike suit/Spring ball',
    label2: 'CF + Spring',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_SPIKE_SUIT_XRAY_CLIMB': {
    label: 'Spike suit/X-ray climb',
    label2: 'CF + X-Ray',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_LAVA_DIVE_GRAVITY_JUMP': {
    label: 'Gravity jump',
    label2: 'Gravity',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_LAVA_DIVE_GRAVITY_HI_JUMP': {
    label: 'Gravity jump easy',
    label2: 'Gravity + Hi-Jump',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_LAVA_DIVE': {
    label: 'Only hi-jump',
    label2: 'Hi-Jump',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_LAVA_DIVE_HARD': {
    label: 'Fireball (hard)',
    label2: '(Varia + 1E) or 2E',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_BOMB_JUMP': {
    label: 'Bomb jump',
    label2: 'Bombs',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_WORST_ROOM_WALL_JUMP': {
    label: 'Wall jump',
    label2: 'Hi-Jump',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_WORST_ROOM_INSANE_WALL_JUMP': {
    label: 'Wall jump without Hi-Jump - Insane',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_WORST_ROOM_SPRING_BALL_JUMP': {
    label: 'Spring ball jump',
    label2: 'Spring',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_WORST_ROOM_FREEZE': {
    label: 'Freeze',
    label2: 'Charge + Ice',
    type: 'boolean',
    defaultValue: false
  },
  'GO_MODE_WRECKED_SHIP_FORGOTTEN_HIGHWAY': {
    label: 'Forgotten Highway',
    label2: 'Gravity',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_WRECKED_SHIP_SHINE_SPARK': {
    label: 'Shine spark',
    label2: 'Speed',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_WRECKED_SHIP_SPRING_BALL_BOUNCE': {
    label: 'Spring ball bounce',
    label2: 'Spring',
    type: 'boolean',
    defaultValue: true
  },
  'GO_MODE_WRECKED_SHIP_CWJ': {
    label: 'Continuous Wall Jump',
    type: 'boolean',
    defaultValue: true
  }
}

export default createContext({})
