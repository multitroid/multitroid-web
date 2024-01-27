import { memo } from 'react'

export default memo(({ className = '', style = {}, stroke = 'white' }) => {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className={className} style={style}>
    <path stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 2v16m0 0l-7-7m7 7l7-7"/>
  </svg>
})
