import React from 'react'
import Energy from './Energy'
import Reserve from './Reserve'
import Ammo from './Ammo'
import Minimap from './Minimap'

export default React.memo(() => <div className="p-2 position-relative" style={{
  fontSize: '0.8rem',
}}>
  <div className="d-inline-block align-top">
    <Energy/>
    <Reserve/>
  </div>
  <div className="d-inline-block align-top" style={{ marginRight: '81px' }}>
    <Ammo/>
  </div>
  <Minimap/>
</div>)
