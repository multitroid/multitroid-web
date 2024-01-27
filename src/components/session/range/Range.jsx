import React from 'react'
import { useContextSelector } from 'use-context-selector'
import RangeContext from '../../../context/RangeContext'
import OptionsContext from '../../../context/OptionsContext'
import Panel from '../../Panel'
import ConsumableContext from '../../../context/ConsumableContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import WebSocketContext from '../../../context/WebSocketContext'

export default React.memo(({ name }) => {

  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)
  const visible = useContextSelector(OptionsContext, o => o.getOptionValue(name))
  const range = useContextSelector(RangeContext, r => r[name])
  const missileExists = useContextSelector(ConsumableContext, c => c?.['Missile'] !== undefined)
  const canCheat = useContextSelector(SessionDetailsContext, sd => sd?.canCheat) && missileExists
  const sendMessage = useContextSelector(WebSocketContext, ws => ws.sendMessage)

  if (!visible || !range || !range.range) {
    return null
  }

  const toggleBit = (triggered, index, mask) => {
    const msg = {
      type: 'BitUpdate',
      name: name,
      index: index,
      mask: mask,
      value: triggered ? 0 : 1
    }
    sendMessage(msg)
  }

  const list = []
  range.bitDescriptors.forEach((bitDescriptor, i) => {
    const { index, mask, name } = bitDescriptor
    const triggered = (range.range[index] & mask) !== 0
    const styleClsCanCheat = canCheat ? 'hand' : ''
    const styleClsTriggered = triggered ? 'range-value-enabled' : 'range-value-disabled'
    list.push(
      <div
        key={i}
        onClick={() => canCheat && toggleBit(triggered, index, mask)}
        className={`${styleClsCanCheat} ${styleClsTriggered} is-size-7`}>
        <span className="range-circle"/>{name}
      </div>
    )
  })

  return <div>
    <Panel>
      <div className="pt-4 px-4 pb-2 position-relative">
        <div className="mb-1">{name}</div>
        <div className="position-absolute top-0 end-0 me-2" style={{ zIndex: 100 }}>
          <span title="Close" className="ms-2 align-middle">
            <span className="fmt fs-4 align-middle hand text-secondary"
              onClick={() => setOptionValue(name, false)}>
              &#10007;
            </span>
          </span>
        </div>
      </div>
      {list}
    </Panel>
  </div>

})
