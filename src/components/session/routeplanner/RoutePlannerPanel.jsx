import React, { useState } from 'react'
import RoutePlannerConfig from './RoutePlannerConfig'
import RoutePlanner from './RoutePlanner'
import { useContextSelector } from 'use-context-selector'
import OptionsContext from '../../../context/OptionsContext'

export default React.memo(({ showPopup }) => {

  const [configuring, setConfiguring] = useState(false)
  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)

  return <>
    {showPopup && <div className="position-absolute top-0 end-0 me-2" style={{ zIndex: 100 }}>
      <span className="ms-2 align-middle">
        <span className={`fmt fs-5 align-middle hand ${configuring ? 'text-success' : 'text-secondary'}`} onClick={() => setConfiguring(!configuring)}>
          &#9881;
        </span>
      </span>
      <span title="Close" className="ms-2 align-middle">
          <span className="fmt fs-4 align-middle hand text-secondary"
            onClick={() => setOptionValue('RoutePlanner', false)}>
            &#10007;
          </span>
        </span>
    </div>}
    {configuring ? <RoutePlannerConfig/> : <RoutePlanner setConfiguring={setConfiguring}/>}
  </>
})
