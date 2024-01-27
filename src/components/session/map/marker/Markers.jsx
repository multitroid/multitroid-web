import React from 'react'
import Marker from './Marker'
import SessionDetailsContext from '../../../../context/SessionDetailsContext'
import ClientContext from '../../../../context/ClientContext'
import OptionsContext from '../../../../context/OptionsContext'
import { useContextSelector } from 'use-context-selector'
import { parse } from 'query-string'

const gameStates = [0x06, 0x07, 0x08, 0x09, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12]

export default React.memo(() => {

  const areas = useContextSelector(SessionDetailsContext, sd => sd.game.map.areas)
  const clients = useContextSelector(ClientContext, c => c.clients)
  const pulseOption = useContextSelector(OptionsContext, o => o.getOptionValue('MAP_MARKER_PULSE'))
  const query = parse(location.search)
  const pulse = query.panel ? query?.pulse !== 'false' : pulseOption

  const markers = []

  for (let key of Object.keys(clients)) {
    const client = clients[key]
    if (client.ScreenX < 0 || client.ScreenY < 0 || !gameStates.includes(client.GameState)) {
      continue
    }
    areas.forEach(area => {
      area.rooms.forEach(room => {
        if (room.address !== (0x70000 + client.Room)) {
          return
        }

        const x = area.x + room.x + client.ScreenX
        const y = 1 + area.y + room.y + client.ScreenY

        markers.push(
          <Marker key={key} x={x} y={y} color={client.color} type={client.icon} pulse={pulse}/>
        )
      })
    })
  }

  return <g>
    {markers}
  </g>

})
