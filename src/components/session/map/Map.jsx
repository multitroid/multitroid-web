import React from 'react'
import SmallMap from './SmallMap'
import Expand from '../../../images/icons/Expand'
import Compress from '../../../images/icons/Compress'
import { useContextSelector } from 'use-context-selector'
import OptionsContext from '../../../context/OptionsContext'

export default React.memo(() => {

  const bigMap = useContextSelector(OptionsContext, o => o.getOptionValue('BIG_MAP'))
  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)

  return <div className={`position-relative ${bigMap ? 'span2h span2v' : ''}`}>
    <div className="border bg-black">
      <div className="position-absolute top-0 end-0 me-2" style={{ zIndex: 100 }}>
        <span className="fmt fs-5 hand align-middle" onClick={() => setOptionValue('BIG_MAP', !bigMap)}>
          {bigMap
            ? <Compress style={{ width: 12, height: 12 }} fill="#888888"/>
            : <Expand style={{ width: 12, height: 12 }} fill="#888888"/>}
        </span>
        <span title="Close" className="ms-2 align-middle">
          <span className="fmt fs-4 align-middle hand text-secondary"
            onClick={() => setOptionValue('MAP', false)}>
            &#10007;
          </span>
        </span>
      </div>
      <SmallMap/>
    </div>
  </div>

})
