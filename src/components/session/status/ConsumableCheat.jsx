import React, { useEffect, useRef, useState } from 'react'
import WebSocketContext from '../../../context/WebSocketContext'
import { useContextSelector } from 'use-context-selector'

export default ({ name, current = 0, currentMax = 0, min = 0, max = 0, close }) => {

  const sendMessage = useContextSelector(WebSocketContext, ws => ws.sendMessage)
  const [val, setVal] = useState(current)
  const [maxVal, setMaxVal] = useState(currentMax)
  const valRef = useRef()

  const cheat = () => {
    const sendMax = Math.max(min, Math.min(maxVal, max))
    sendMessage({
      type: 'ConsumableUpdate',
      name: `Max ${name}`,
      value: sendMax,
      diff: 0,
      force: true
    })
    sendMessage({
      type: 'ConsumableUpdate',
      name: name,
      value: Math.max(min, Math.min(val, sendMax)),
      diff: 0,
      force: true
    })
    close()
  }

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      cheat()
    }
  }

  useEffect(() => {
    valRef?.current?.select()
  }, [])

  return (
    <div className="position-absolute top-0 left-0 bg-black border p-3" style={{ zIndex: 9999, width: '12rem' }}>
      <div className="mb-2">
        <label className="form-label">{name}</label>
        <input
          className="form-control"
          ref={valRef}
          type="number"
          min={min}
          max={max}
          onKeyPress={onKeyPress}
          size={10}
          value={val}
          onChange={e => setVal(e.target.value)}/>
      </div>

      <div className="mb-2">
        <label className="form-label">Max {name}</label>
        <input
          className="form-control"
          type="number"
          min={min}
          max={max}
          onKeyPress={onKeyPress}
          size={10}
          value={maxVal}
          onChange={e => setMaxVal(e.target.value)}/>
      </div>

      <div className="cheat-buttons pt-2">
        <button className="btn btn-danger" type="button" onClick={cheat}>Cheat</button>
        <button className="btn btn-secondary" type="button" onClick={close}>Close</button>
      </div>
    </div>
  )

}
