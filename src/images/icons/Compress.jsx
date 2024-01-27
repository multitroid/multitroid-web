import { memo } from 'react'

export default memo(({ className = '', style = {}, fill, fillOpacity = 1 }) => {
  return <svg version="1.1" viewBox="0 0 339.411 339.411" className={className} style={style}>
    <polygon style={{ fill: fill, fillOpacity: fillOpacity }} points="339.411,21.213 318.198,0 226.274,91.924 176.022,41.672 176.022,163.596 297.946,163.596 247.487,113.137 	"/>
    <polygon style={{ fill: fill, fillOpacity: fillOpacity }} points="163.595,176.022 41.672,176.022 91.924,226.275 0,318.198 21.213,339.411 113.137,247.488 163.596,297.947 	"/>
  </svg>
})
