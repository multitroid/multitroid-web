export const tileTypesThatCount = [
  0x1B, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2B, 0x2A, 0x5E, 0x6E, 0x6F, 0x76, 0x77,
  0x8E, 0x8F, 0x4D, 0x4F, 0x10, 0x5F
]

export const getVisitedTileCount = (ranges, map) => {
  let visitedTileCount = 0
  for (const key in ranges) {
    if (!key.startsWith('MAP ') || key.startsWith('MAP Current')) {
      continue
    }

    const range = ranges[key]
    if (!range.range) {
      continue
    }
    const area = map?.areas.find(minimap => minimap.name === range.name.substr(4).toUpperCase())
    if (!area) {
      continue
    }

    let currentX = 0
    let currentY = 0
    let overHalf = 0

    range.range.forEach(byte => {
      for (let i = 7; i >= 0; i--) {
        const tileData = area.map[currentX][currentY]
        const tile = (tileData >> 8) & 0xFF
        if (tileTypesThatCount.includes(tile)) {
          let bit = byte & (1 << i) ? 1 : 0
          if (bit > 0) {
            visitedTileCount++
          }
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
    })
  }

  return visitedTileCount
}
