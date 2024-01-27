import React from 'react'
import { popoutPanels } from './SessionWrapper'
import { useContextSelector } from 'use-context-selector'
import SessionDetailsContext from '../../context/SessionDetailsContext'
import { Link } from 'react-router-dom'
import OptionsContext from '../../context/OptionsContext'


export default () => {

  const sessionId = useContextSelector(SessionDetailsContext, sd => sd?.id)
  const mode = useContextSelector(SessionDetailsContext, sd => sd.mode)
  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)

  return <div className="p-4 position-relative">
    <div className="position-absolute top-0 end-0 me-2">
      <span title="Close" className="ms-2 align-middle">
        <span className="fmt fs-4 align-middle hand text-secondary"
          onClick={() => setOptionValue('BrowserSourceLinks', false)}>
          &#10007;
        </span>
      </span>
    </div>
    <div className="mb-1">Streaming? Try these as browser sources!</div>
    {Object.entries(popoutPanels)
      .filter(([, value]) => value.filterFn(mode))
      .map(([key, value]) => <div key={key}>
        <Link className="link-light" target="_blank" rel="noreferrer"
          to={`/${sessionId}?panel=${key}${value.defaultParams || ''}`}>
          {value.name}
        </Link>
      </div>)}
  </div>
}
