import { memo } from 'react'

export default memo(({ className = '', style = {}, fill, fillOpacity = 1 }) => {
  return <svg version="1.1" viewBox="0 0 32 32" className={className} style={style}>
    <path style={{ fill: fill, fillOpacity: fillOpacity }} d="M32,0H8v8C5.094,8,0,8,0,8v24h24v-8h8V0z M20,28H4V16h4v8h12C20,25.789,20,28,20,28z M28,20H12V8h16   V20z"/>
  </svg>
})
