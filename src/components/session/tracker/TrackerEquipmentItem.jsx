import React from 'react'
import RangeContext from '../../../context/RangeContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import WebSocketContext from '../../../context/WebSocketContext'
import ConsumableContext from '../../../context/ConsumableContext'
import { useContextSelector } from 'use-context-selector'


export default React.memo(({ bitDescriptorName, image, rangeName = 'EQUIPMENT' }) => {

  const consumables = useContextSelector(ConsumableContext, c => c)
  const canCheat = useContextSelector(SessionDetailsContext, sd => sd?.canCheat) && consumables?.['Missile'] !== undefined
  const sendMessage = useContextSelector(WebSocketContext, ws => ws.sendMessage)
  const bitDescriptor = useContextSelector(RangeContext, r => r[rangeName]?.bitDescriptors?.find(bd => bd.name === bitDescriptorName))
  const gotEquipment = useContextSelector(RangeContext, r => {
    if (bitDescriptor) {
      return (r[rangeName].range[bitDescriptor?.index] & bitDescriptor?.mask) !== 0
    }
    return false
  })

  const cheat = () => {
    sendMessage({
      type: 'BitUpdate',
      name: rangeName,
      index: bitDescriptor.index,
      mask: bitDescriptor.mask,
      value: gotEquipment ? 0 : 1
    })
  }

  return <img
    width={32}
    height={32}
    onClick={canCheat ? cheat : undefined}
    alt={bitDescriptorName}
    style={{ opacity: gotEquipment ? 1 : 0.4, filter: gotEquipment ? '' : 'grayscale(100%)' }}
    className={`me-2 ${canCheat ? 'hand' : ''}`}
    src={image}
  />

})
