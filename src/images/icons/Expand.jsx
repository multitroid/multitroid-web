import { memo } from 'react'

export default memo(({ className = '', style = {}, fill, fillOpacity = 1 }) => {
  return <svg version="1.1" viewBox="0 0 352.054 352.054" className={className} style={style}>
    <polygon style={{ fill: fill, fillOpacity: fillOpacity }} points="144.206,186.634 30,300.84 30,238.059 0,238.059 0,352.054 113.995,352.054 113.995,322.054 51.212,322.054 165.419,207.847 	"/>
    <polygon style={{ fill: fill, fillOpacity: fillOpacity }} points="238.059,0 238.059,30 300.84,30 186.633,144.208 207.846,165.42 322.054,51.213 322.054,113.995 352.054,113.995 352.054,0 	"/>
  </svg>
})
