import React, { useState } from 'react'
import Layers from './layer/Layers'
import TileDefinitions from './layer/TileDefinitions'
import Markers from './marker/Markers'
import OptionsContext from '../../../context/OptionsContext'
import { useContextSelector } from 'use-context-selector'

export default React.memo(() => {

  const zoomed = useContextSelector(OptionsContext, o => o.getOptionValue('MAP_ZOOM_SMALL'))
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  })

  return <div style={{ display: 'flex', justifyContent: 'center' }} className={zoomed ? 'zoomed' : ''}>
    <svg shapeRendering="crispEdges" style={{ width: '100%', aspectRatio: '1/1' }}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}>
      <TileDefinitions/>
      <Layers setViewBox={setViewBox} zoom={zoomed}/>
      <Markers/>
    </svg>
  </div>

})
