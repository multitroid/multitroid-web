import React, { useState } from 'react'
import Layers from './layer/Layers'
import TileDefinitions from './layer/TileDefinitions'
import Markers from './marker/Markers'
import { parse } from 'query-string'


export default React.memo(() => {
  const zoom = parse(location.search)?.panel === 'map_zoom'
  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  })

  return <div style={{ display: 'flex', justifyContent: 'center' }}>
    <svg style={{ maxWidth: '100vw', maxHeight: '100vh', aspectRatio: '1/1' }} shapeRendering="crispEdges"
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}>
      <TileDefinitions/>
      <Layers setViewBox={setViewBox} zoom={zoom}/>
      <Markers/>
    </svg>
  </div>
})
