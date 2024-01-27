import React from 'react'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import RangeContext from '../../../context/RangeContext'
import { getVisitedTileCount } from '../../../util/tile'
import { useContextSelector } from 'use-context-selector'


export default React.memo(() => {

  const sessionDetails = useContextSelector(SessionDetailsContext, sd => sd)
  const ranges = useContextSelector(RangeContext, r => r)
  const map = sessionDetails?.game?.map
  const visitedTileCount = getVisitedTileCount(ranges, map)

  return <div className="minimap fmt" style={{ position: 'absolute', right: '0.5rem', top: '0.5rem', paddingTop: 1 }}>
    <div>{visitedTileCount}</div>
    <div>of</div>
    <div>{sessionDetails.tileCount}</div>
  </div>

})
