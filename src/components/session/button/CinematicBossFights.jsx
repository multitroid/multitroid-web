import React from 'react'
import Ridley from './Ridley'
import Kraid from './Kraid'
import Draygon from './Draygon'
import { useContextSelector } from 'use-context-selector'
import RangeContext from '../../../context/RangeContext'
import ClientContext from '../../../context/ClientContext'
import ConsumableContext from '../../../context/ConsumableContext'
import Phantoon from './Phantoon'
import MB from './MB'


const gameStates = [0x06, 0x07, 0x08, 0x09, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12]

const checkBit = (eventRange, bitDescriptor) => {
  return (eventRange.range[bitDescriptor.index] & bitDescriptor.mask) !== 0
}

export default React.memo(() => {

  const missileExists = useContextSelector(ConsumableContext, c => c?.['Missile'] !== undefined)
  const clients = useContextSelector(ClientContext, c => c.clients)
  const eventRange = useContextSelector(RangeContext, r => r['EVENT'])
  const kraidBitDescriptor = eventRange?.bitDescriptors?.find(bd => bd.name === 'Kraid')
  const ridleyBitDescriptor = eventRange?.bitDescriptors?.find(bd => bd.name === 'Ridley')
  const draygonBitDescriptor = eventRange?.bitDescriptors?.find(bd => bd.name === 'Draygon')
  const phantoonBitDescriptor = eventRange?.bitDescriptors?.find(bd => bd.name === 'Phantoon')
  const mbBitDescriptor = eventRange?.bitDescriptors?.find(bd => bd.name === 'Motherbrain_Dead')

  if (!missileExists || !kraidBitDescriptor || !ridleyBitDescriptor || !draygonBitDescriptor || !phantoonBitDescriptor || !mbBitDescriptor) {
    return null
  }

  const clientRooms = Object.values(clients)
    .filter(client => client.ScreenX >= 0 && client.ScreenY >= 0 && gameStates.includes(client.GameState))
    .map(client => client.Room)

  const kraid = !checkBit(eventRange, kraidBitDescriptor) && clientRooms.includes(42399)
  const ridley = !checkBit(eventRange, ridleyBitDescriptor) && clientRooms.includes(45870)
  const phantoon = !checkBit(eventRange, phantoonBitDescriptor) && clientRooms.includes(52499)
  const draygon = !checkBit(eventRange, draygonBitDescriptor) && clientRooms.includes(55904)
  const mb = !checkBit(eventRange, mbBitDescriptor) && clientRooms.includes(56664)

  return <>
    {kraid && <Kraid/>}
    {ridley && <Ridley/>}
    {phantoon && <Phantoon/>}
    {draygon && <Draygon/>}
    {mb && <MB/>}
  </>

})
