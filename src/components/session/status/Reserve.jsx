import React, { useState } from 'react'
import ConsumableContext from '../../../context/ConsumableContext'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import ConsumableCheat from './ConsumableCheat'
import { useContextSelector } from 'use-context-selector'

export default React.memo(() => {

  const canCheat = useContextSelector(SessionDetailsContext, sd => sd?.canCheat)
  const reserve = useContextSelector(ConsumableContext, c => c?.['Reserve']?.value)
  const reserveMax = useContextSelector(ConsumableContext, c => c?.['Max Reserve']?.value)
  const [cheatDialog, setCheatDialog] = useState(false)

  const cls = canCheat ? 'reserve fmt hand' : 'reserve fmt'

  if (reserve === undefined) {
    return null
  }

  const color = reserve > 0 ? 'orange' : 'blue'

  return (
    <div className="position-relative d-inline-block align-top">
      <div className={cls} style={{ color: color }} onClick={() => canCheat && setCheatDialog(true)}>
        {reserveMax > 0 ? <div>&larr;</div> : <div>&nbsp;</div>}
        {reserveMax > 0 ? <div>{reserve}</div> : <div>&nbsp;</div>}
        {reserveMax > 0 ? <div>&larr;</div> : <div>&nbsp;</div>}
      </div>
      {cheatDialog && <ConsumableCheat name="Reserve" current={reserve} currentMax={reserveMax} max={400} close={() => setCheatDialog(false)}/>}
    </div>
  )

})
