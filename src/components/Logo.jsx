import React from 'react'
import logo from '../images/ai/samuses.png'

export default React.memo(() => <div className="text-shadow-3">
  <img className="logo-image" alt="Logo with three Samuses" src={logo}/>
  <h1 className="fmt text-uppercase h3 me-2 position-relative logo-text">Multitroid</h1>
</div>)
