import React, { useState } from 'react'
import ConsumableContext from '../../../context/ConsumableContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import ConsumableCheat from './ConsumableCheat'
import { useContextSelector } from 'use-context-selector'

const pad = (num, places) => {
  const zero = places - num.toString().length + 1
  return new Array(+(zero > 0 && zero)).join('0') + num
}

export default React.memo(() => {

  const consumables = useContextSelector(ConsumableContext, c => c)
  const canCheat = useContextSelector(SessionDetailsContext, sd => sd?.canCheat)
    && (consumables?.['Energy'] !== undefined)
  const [cheatDialog, setCheatDialog] = useState(false)

  const energy = consumables['Energy']?.value || 0
  const energyMax = consumables['Max Energy']?.value || 0
  const tanks = []

  for (let i = 0; i < (energyMax / 100) - 1; i++) {
    if ((i + 1) * 100 < energy) {
      tanks.push(<div className="energy-tank filled-energy-tank" key={i}/>)
    } else {
      tanks.push(<div className="energy-tank" key={i}/>)
    }
  }

  return (
    <div className="position-relative energy">
      <div className={canCheat ? 'fmt hand' : 'fmt'} onClick={() => canCheat && setCheatDialog(true)}>
        <div className="d-flex energy-tanks" style={{ flexWrap: 'wrap-reverse' }}>
          {tanks}
        </div>
        <div>
          ENERGY&nbsp;&nbsp;{pad(energy % 100, 2)}
        </div>
      </div>
      {cheatDialog && <ConsumableCheat name="Energy" current={energy} currentMax={energyMax} min={99} max={1499} close={() => setCheatDialog(false)}/>}
    </div>
  )


})
