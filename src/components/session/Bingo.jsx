import React from 'react'
import { groupBy } from '../../util/groupBy'
import BingoContext from '../../context/BingoContext'
import SessionDetailsContext from '../../context/SessionDetailsContext'
import { useContextSelector } from 'use-context-selector'
import RangeContext from '../../context/RangeContext'

const hiddenTile = ['Hidden until Morphing Ball', null]
const hiddenTiles = Array(25).fill(hiddenTile)

export default React.memo(() => {

  const sessionDetails = useContextSelector(SessionDetailsContext, sd => sd)
  const bingo = useContextSelector(BingoContext, b => b)
  const morphBitDescriptor = useContextSelector(RangeContext, r => r['EQUIPMENT']?.bitDescriptors?.find(bd => bd.name === 'MORPHING_BALL'))
  const gotMorph = useContextSelector(RangeContext, r => (r['EQUIPMENT']?.range[morphBitDescriptor?.index] & morphBitDescriptor?.mask) !== 0)

  if (Object.entries(bingo.tiles).length === 0) {
    return null
  }

  const hidden = !gotMorph

  const tiles = hidden ? hiddenTiles : Object.entries(bingo.tiles)
  const tilesThatHaveBeenCompleted = tiles.filter(tile => tile[1])
  const score = groupBy(tilesThatHaveBeenCompleted, tile => tile[1])

  const sortedScore = Object.entries(score)
    .sort((a, b) => {
      if (a[1] < b[1]) {
        return -1
      }
      if (a[1] > b[1]) {
        return 1
      }
      return 0
    })
    .filter(s => s[0] !== 'Impossible')

  const bingoText = sortedScore.length === 1 ? 'BINGO' : 'DONE'

  return <div className="">
    <div
      className="bingo-board position-relative m-1"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr 1fr 1fr',
        gridGap: '2px'
      }}>
      {bingo.bingo && !hidden && <div className="rainbow-text">{bingoText}</div>}
      {tiles.map((tile, i) => {
        const completedByThisSession = tile[1] === sessionDetails.id
        const impossible = tile[1] === 'Impossible'
        const color = completedByThisSession ? 'limegreen' : impossible ? 'darkgray' : tile[1] ? 'red' : 'gray'
        const backgroundColor = completedByThisSession ? 'darkgreen' : impossible ? 'gray' : tile[1] ? 'darkred' : 'none'
        return <div
          key={i}
          className="p-1 border border-1 border-secondary"
          style={{
            color: color,
            background: backgroundColor,
            textAlign: 'center',
            display: 'grid',
            justifyContent: 'center',
            alignContent: 'center',
            minHeight: '100px'
          }}>
          {tile[0]}
        </div>
      })}
    </div>

    <div className="p-4">
      <div className="mt-2"><strong>Bingo seed:</strong><br/>{bingo.id}</div>
      {sortedScore.length > 1 && <div className="mt-2">
        <div><strong>Score:</strong></div>
        {sortedScore.map(s => {
          const isThisSession = s[0] === sessionDetails.id
          const shortId = s[0].substring(0, 8)
          return <div key={s[0]}
            className={isThisSession ? 'text-success' : 'text-warning'}>{isThisSession ? 'YOU' : shortId}: {s[1].length}</div>
        })}
      </div>}

      {bingo.bingosNeeded && <div>
        <div className="mt-2"><strong>Bingos needed to win:</strong></div>
        <div>{bingo.bingosNeeded}</div>
      </div>}
    </div>

  </div>

})
