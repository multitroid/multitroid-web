import React from 'react'
import { useContextSelector } from 'use-context-selector'
import RangeContext from '../../../../context/RangeContext'
import OptionsContext from '../../../../context/OptionsContext'
import SessionDetailsContext from '../../../../context/SessionDetailsContext'
import { parse } from 'query-string'

const getColorFromQueryParam = (str) => {
  if (!str) {
    return undefined
  }
  if (CSS.supports('color', `#${str}`)) {
    return `#${str}`
  }
  if (CSS.supports('color', str)) {
    return str
  }
  return undefined
}

export default React.memo(({ rangeName }) => {
  const queryParams = parse(location.search)
  const colorUnvisitedQueryParam = getColorFromQueryParam(queryParams?.color_unvisited)
  const colorVisitedQueryParam = getColorFromQueryParam(queryParams?.color_visited)
  const colorUnvisitedOption = useContextSelector(OptionsContext, o => o.getOptionValue('MapColorUnvisited'))
  const colorVisitedOption = useContextSelector(OptionsContext, o => o.getOptionValue('MapColorVisited'))
  const colorUnvisited = colorUnvisitedQueryParam || colorUnvisitedOption
  const colorVisited = colorVisitedQueryParam || colorVisitedOption
  const map = useContextSelector(SessionDetailsContext, sd => sd.game.map)
  const range = useContextSelector(RangeContext, r => r[rangeName])

  if (!range) {
    return null
  }
  const area = map.areas.find(a => a.name === range.name.substr(4).toUpperCase())
  if (!area) {
    return null
  }

  let currentX = 0
  let currentY = 0
  let overHalf = 0

  const tiles = []

  for (let i = 0; i < range.range.length; i++) {
    const current = range.range[i]
    for (let i2 = 7; i2 >= 0; i2--) {
      const tileData = area.map[currentX][currentY]
      const tile = tileData >> 8

      if (tile !== 0x1F) {
        const fillColor = ((current >> i2) & 1) !== 0 ? colorVisited : colorUnvisited
        const flip = (tileData >> 6) & 3
        const tileHex = tile.toString(16).toUpperCase()
        const posX = (area.x + currentX) * 8
        const posY = (area.y + currentY) * 8

        let flipH = false
        let flipV = false

        if ((flip & 1) !== 0) {
          flipH = true
        }

        if ((flip & 2) !== 0) {
          flipV = true
        }

        const key = area.name + currentX + 'x' + currentY
        let href = '#T' + tileHex + (flipH ? 'H' : '') + (flipV ? 'V' : '')

        const x = currentX
        const y = currentY

        tiles.push(
          <use key={key}
            onClick={() => console.log(area.name, x, y, tileHex)}
            transform={'translate(' + posX + ' ' + posY + ')'}
            href={href}
            style={{ fill: fillColor }}>
          </use>
        )
      }

      currentX++
      if (currentX >= 32 + overHalf) {
        currentY = currentY + 1
        currentX = overHalf
      }
      if (currentY >= 32) {
        overHalf = 32
        currentY = 0
        currentX = overHalf
      }
    }
  }

  return <g name={area.name} key={area.name}>
    {tiles}
  </g>
})

