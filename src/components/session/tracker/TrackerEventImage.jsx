import React from 'react'
import RangeContext from '../../../context/RangeContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import WebSocketContext from '../../../context/WebSocketContext'
import ConsumableContext from '../../../context/ConsumableContext'
import { useContextSelector } from 'use-context-selector'


export default React.memo(({ bitDescriptorName, image, top, right, zIndex }) => {

  const missileExists = useContextSelector(ConsumableContext, c => c?.['Missile'] !== undefined)
  const canCheat = useContextSelector(SessionDetailsContext, sd => sd?.canCheat) && missileExists
  const sendMessage = useContextSelector(WebSocketContext, ws => ws.sendMessage)
  const eventRange = useContextSelector(RangeContext, r => r['EVENT'])
  const bitDescriptor = useContextSelector(RangeContext, r => r['EVENT'].bitDescriptors.find(bd => bd.name === bitDescriptorName))

  if (!bitDescriptor) {
    return null
  }

  const triggeredEvent = (eventRange.range[bitDescriptor.index] & bitDescriptor.mask) !== 0

  const cheat = () => {
    sendMessage({
      type: 'BitUpdate',
      name: 'EVENT',
      index: bitDescriptor.index,
      mask: bitDescriptor.mask,
      value: triggeredEvent ? 0 : 1
    })
  }

  return <img
    style={{
      top: top,
      right: right,
      zIndex: zIndex,
      opacity: triggeredEvent ? 1 : 0.1,
      position: 'absolute'
    }}
    onClick={canCheat ? cheat : undefined}
    className={canCheat ? 'hand' : ''}
    src={image}
  />
})
