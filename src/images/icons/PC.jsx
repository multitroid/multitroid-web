import { memo } from 'react'

export default memo(({ className = '', style = {}, fill, fillOpacity = 1 }) => {
  return <svg version="1.1" viewBox="0 0 512 512" className={className} style={style}>
    <path style={{ fill: fill, fillOpacity: fillOpacity }} d="M403.217,383.405v-77.396h68.894V0H39.888v306.009h68.894v77.396H0V512h512V383.405H403.217z M93.47,252.428V53.582
			h325.061v198.846H93.47z M78.215,473.988H44.823v-52.391h33.391V473.988z M125.843,473.988H92.452v-52.391h33.391V473.988z
			 M173.471,473.988H140.08v-52.391h33.391V473.988z M461.594,461.532H344.905v-33.391h116.688V461.532z"/>
  </svg>
})
