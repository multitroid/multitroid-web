import Vanilla from '../components/connect/explanation/roms/Vanilla'
import Randomizer from '../components/connect/explanation/roms/Randomizer'
import Varia from '../components/connect/explanation/roms/Varia'
import MapCounter from '../components/connect/explanation/roms/MapCounter'
import Ascent from '../components/connect/explanation/roms/Ascent'
import Dash from '../components/connect/explanation/roms/Dash'

export const roms = [
  {
    name: 'Vanilla',
    value: 'VANILLA',
    modes: true,
    romExplanation: <Vanilla/>
  },
  {
    name: 'VARIA Randomizer',
    value: 'VARIA',
    modes: false,
    romExplanation: <Varia/>
  },
  {
    name: 'DASH Randomizer',
    value: 'DASH',
    modes: false,
    romExplanation: <Dash/>
  },
  {
    name: 'Item Randomizer',
    value: 'ITEM_RANDOMIZER',
    modes: false,
    romExplanation: <Randomizer/>
  },
  {
    name: 'Map counter hack',
    value: 'MAP_TILES',
    modes: false,
    romExplanation: <MapCounter/>
  },
  {
    name: 'Ascent',
    value: 'ASCENT',
    modes: false,
    romExplanation: <Ascent/>
  }
]
