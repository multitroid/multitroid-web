import React, { useState } from 'react'
import ConsumableContext from '../../../context/ConsumableContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import ConsumableCheat from './ConsumableCheat'
import { useContextSelector } from 'use-context-selector'

export default React.memo(() => {

  const canCheat = useContextSelector(SessionDetailsContext, sd => sd?.canCheat)
  const consumables = useContextSelector(ConsumableContext, c => c)
  const [cheatDialog, setCheatDialog] = useState(undefined)

  const missile = consumables?.['Missile']?.value || 0
  const missileMax = consumables?.['Max Missile']?.value || 0
  const superMissile = consumables?.['Super Missile']?.value || 0
  const superMissileMax = consumables?.['Max Super Missile']?.value || 0
  const powerbomb = consumables?.['Powerbomb']?.value || 0
  const powerbombMax = consumables?.['Max Powerbomb']?.value || 0

  if (consumables?.['Missile'] === undefined) {
    return null
  }

  return (
    <div className="ammo">
      <span className="ammo-type">
        <div className="position-relative">
          <div className={canCheat ? 'hand' : ''} onClick={() => setCheatDialog('Missile')}>
            <div className="fmt text-center" style={{ color: 'red' }}>M</div>
            <div className="fmt text-center text-secondary">{missileMax}</div>
            <div className="fmt text-center text-body">{missile}</div>
          </div>
          {canCheat && cheatDialog === 'Missile' && <ConsumableCheat name={cheatDialog} current={missile} currentMax={missileMax} max={230} close={() => setCheatDialog(false)}/>}
        </div>
      </span>
      <span className="ammo-type">
        <div className="position-relative">
          <div className={canCheat ? 'hand' : ''} onClick={() => setCheatDialog('Super Missile')}>
            <div className="fmt text-center" style={{ color: 'limegreen' }}>SM</div>
            <div className="fmt text-center text-secondary">{superMissileMax}</div>
            <div className="fmt text-center text-body">{superMissile}</div>
          </div>
          {canCheat && cheatDialog === 'Super Missile' && <ConsumableCheat name={cheatDialog} current={superMissile} currentMax={superMissileMax} max={50} close={() => setCheatDialog(false)}/>}
        </div>
      </span>
      <span className="ammo-type">
        <div className="position-relative">
          <div className={canCheat ? 'hand' : ''} onClick={() => setCheatDialog('Powerbomb')}>
            <div className="fmt text-center" style={{ color: 'orange' }}>PB</div>
            <div className="fmt text-center text-secondary">{powerbombMax}</div>
            <div className="fmt text-center text-body">{powerbomb}</div>
          </div>
          {canCheat && cheatDialog === 'Powerbomb' && <ConsumableCheat name={cheatDialog} current={powerbomb} currentMax={powerbombMax} max={50} close={() => setCheatDialog(false)}/>}
        </div>
      </span>
    </div>
  )

})
