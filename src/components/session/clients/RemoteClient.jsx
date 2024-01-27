import React from 'react'
import { gameStateNameFromValue, ingameFromValue } from '../../../snes/gamestate'
import Icon from '../map/icon/Icon'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import { useContextSelector } from 'use-context-selector'

const width = 32
const height = 32

export default React.memo(({ client }) => {

  const statuses = useContextSelector(SessionDetailsContext, sd => sd?.game?.statuses)
  const ingame = ingameFromValue(client.GameState)

  return <div className="">
    <div className="d-flex">
      <div className="me-2">
        <svg width={width} height={height}>
          <Icon iconType={client.icon} color={client.color} animated={false} width={width} height={height}/>
        </svg>
      </div>
      <div className="lh-1">
        <div><small>{client.name}</small></div>
        {ingame && <div className="text-secondary">
          <small>{statuses?.find(s => s.name === 'Room')?.valueMap?.[client.Room]}</small>
        </div>}
        {!ingame && <div className="text-secondary">
          <small>{client.GameState ? gameStateNameFromValue(client.GameState) : 'Unknown'}</small>
        </div>}
      </div>
    </div>
  </div>
})
