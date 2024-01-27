import React, { useEffect } from 'react'
import Layer from './Layer'
import SessionDetailsContext from '../../../../context/SessionDetailsContext'
import ClientContext from '../../../../context/ClientContext'
import { useContextSelector } from 'use-context-selector'

const gameStates = [0x06, 0x07, 0x08, 0x09, 0x0B, 0x0C, 0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12]
const minWidth = 12 * 8
const minHeight = 12 * 8

const viewFullMap = (areas, setViewBox) => {
  let maxX = 0, maxY = 0
  areas.forEach(area => {
    area.rooms.forEach(room => {
      maxX = Math.max(maxX, room.x + area.x)
      maxY = Math.max(maxY, room.y + area.y)
    })
  })
  setViewBox({
    x: -8,
    y: -8,
    width: (maxX * 8) + 40,
    height: (maxY * 8) + 40
  })
}

export default React.memo(({ setViewBox, zoom }) => {

  const map = useContextSelector(SessionDetailsContext, sd => sd.game.map)
  const clients = useContextSelector(ClientContext, c => c.clients)

  const updateBBox = () => {
    const areas = map.areas

    if (clients.length === 0) {
      viewFullMap(areas, setViewBox)
      return
    }

    if (zoom) {
      let minX = 9999, minY = 9999, maxX = 0, maxY = 0
      let someoneIngame = false
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

            minX = Math.min(x * 8, minX)
            minY = Math.min(y * 8, minY)
            maxX = Math.max(x * 8, maxX)
            maxY = Math.max(y * 8, maxY)

            someoneIngame = true
          })
        })
      }

      //End of tile
      maxX += 8
      maxY += 8

      if (!someoneIngame) {
        viewFullMap(areas, setViewBox)
        return
      }

      let width = maxX - minX
      let height = maxY - minY

      if (width < minWidth) {
        minX = minX + (width / 2) - (minWidth / 2)
        width = minWidth
      }

      if (height < minHeight) {
        minY = minY + (height / 2) - (minHeight / 2)
        height = minHeight
      }

      setViewBox({
        x: minX - 16,
        y: minY - 16,
        width: width + 32,
        height: height + 32
      })
    }
    else {
      viewFullMap(areas, setViewBox)
    }
  }

  useEffect(() => {
    updateBBox()
  })

  return <g>
    <Layer rangeName="MAP CERES"/>
    <Layer rangeName="MAP CRATERIA"/>
    <Layer rangeName="MAP BRINSTAR"/>
    <Layer rangeName="MAP NORFAIR"/>
    <Layer rangeName="MAP WRECKEDSHIP"/>
    <Layer rangeName="MAP MARIDIA"/>
    <Layer rangeName="MAP TOURIAN"/>
    <Layer rangeName="MAP DEBUG"/>
  </g>
})

