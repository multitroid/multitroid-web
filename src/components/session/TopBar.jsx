import React, { useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import SessionDetailsContext from '../../context/SessionDetailsContext'
import { roms } from '../../util/roms'
import { modes } from '../../util/modes'
import { Link } from 'react-router-dom'
import { useContextSelector } from 'use-context-selector'
import Discord from '../../images/icons/Discord'
import Settings from '../../images/icons/Settings'
import ArrowDown from '../../images/icons/ArrowDown'
import logo from '../../images/ai/logo3.png'


export default React.memo(({ showOptions, setShowOptions }) => {

  const id = useContextSelector(SessionDetailsContext, sd => sd.id)
  const readOnly = useContextSelector(SessionDetailsContext, sd => sd.readOnly)
  const readOnlyId = useContextSelector(SessionDetailsContext, sd => sd.readOnlyId)
  const summaryEnabled = useContextSelector(SessionDetailsContext, sd => sd.summaryEnabled)
  const canCheat = useContextSelector(SessionDetailsContext, sd => sd.canCheat)
  const romName = useContextSelector(SessionDetailsContext, sd => roms.find(rom => rom.value === sd?.game?.name)?.name) || 'Unknown'
  const modeName = useContextSelector(SessionDetailsContext, sd => modes.find(mode => mode.value === sd?.mode)?.name) || 'Unknown'

  const url = document.location.href
  const urlWithoutSessionId = url.substring(0, url.lastIndexOf('/'))
  const sessionUrlReadOnly = `${urlWithoutSessionId}/${readOnlyId}`

  const [copiedSessionId, setCopiedSessionId] = useState(false)
  const [copiedReadOnlySessionId, setCopiedReadOnlySessionId] = useState(false)

  const displayViewerSession = !readOnly && readOnlyId
  const title = canCheat ? 'MULTICHEAT' : 'MULTITROID'

  const optionsIcon = showOptions ? <ArrowDown className="link-icon" stroke="#aaaaaa"/> :
    <Settings className="link-icon" fill="#aaaaaa"/>

  return <div className="p-3">

    <div>
      <img className="topbar-logo-image" alt="Logo with three Samuses" src={logo}/>

      <div className="text-shadow-1 mb-1 position-relative">
        <Link to="/" className="text-decoration-none fwb fmt text-primary">
          <small>{title}</small>
        </Link>
      </div>
    </div>


    <div className="d-flex flex-wrap align-items-end text-shadow-1">
      <div className="text-secondary me-4 text-nowrap">
        [ <span>{romName} / {modeName}</span> ]
      </div>
      {summaryEnabled && <div className="text-secondary me-4 text-nowrap">
        [ <a href={`/summary/${id}`} target="_blank" rel="noreferrer">Session summary</a> ]
      </div>}
      {displayViewerSession && <div className="text-secondary me-4">
        [&nbsp;Copy session for <>
        <CopyToClipboard text={url} onCopy={() => {
          setCopiedSessionId(true)
          setCopiedReadOnlySessionId(false)
        }}>
          <span>
            <span className="hand link-primary text-decoration-underline">
              players
            </span>
            {copiedSessionId && <span className="text-success"> (copied!)</span>}
          </span>
        </CopyToClipboard>
        &nbsp;or&nbsp;
        <CopyToClipboard text={sessionUrlReadOnly}
          onCopy={() => {
            setCopiedReadOnlySessionId(true)
            setCopiedSessionId(false)
          }}>
          <span>
            <span className="hand link-primary text-decoration-underline">
              viewers
            </span>
            {copiedReadOnlySessionId && <span className="text-success"> (copied!)</span>}
          </span>
        </CopyToClipboard>
      </>&nbsp;]
      </div>}
      <div className="text-secondary me-4 text-nowrap">
        [ <span className="link-primary text-decoration-underline hand"
        onClick={setShowOptions}>{optionsIcon}Options</span> ]
      </div>
      <div className="text-secondary text-nowrap">
        [ <a target="_blank" rel="noreferrer" href="https://discord.gg/yQmPm46"><Discord className="link-icon"
        fill="#aaaaaa"/>Discord</a> ]
      </div>
    </div>
  </div>

})
