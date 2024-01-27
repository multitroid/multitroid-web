import React, { useState } from 'react'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import OptionsContext from '../../../context/OptionsContext'
import PC from '../../../images/icons/PC'
import SNES from '../../../images/icons/SNES'
import Icon from '../map/icon/Icon'
import { useContextSelector } from 'use-context-selector'
import { useWebSocketWorker } from '../../../hooks/WebSocketWorker'
import { getHost, wsProtocol } from '../../../util/url'


const getStatusString = (s) => {
  if (s.connectedToSnes === 0) {
    return 'Connect'
  } else if (s.connectedToSnes < 2) {
    return 'Connecting SNES'
  } else if (s.connectedToServer < 2) {
    return 'Connecting server'
  } else if (s.sync === 0) {
    return 'Patching ROM...'
  } else if (s.sync === 1) {
    return 'Ready to play'
  } else if (s.sync === 2) {
    return 'Syncing...'
  } else if (s.sync === 3) {
    return 'Playing'
  } else {
    return '?'
  }
}

const getStatusColor = (s) => {
  const playing = s.connectedToSnes === 2 && s.connectedToServer === 2 && s.sync === 3
  if (playing) {
    return 'forestgreen'
  }
  if (s.connectedToSnes === 0) {
    return '#cccccc'
  } else if (s.connectedToSnes < 2) {
    return '#cccccc'
  } else if (s.connectedToServer < 2) {
    return '#cccccc'
  } else if (s.sync === 0) {
    return 'orange'
  } else if (s.sync === 1) {
    return 'cornflowerblue'
  } else if (s.sync === 2) {
    return 'cornflowerblue'
  } else if (s.sync === 3) {
    return 'forestgreen'
  } else {
    return '#cccccc'
  }
}

export default React.memo(({ localClient, remoteClient, emulator }) => {

  const { connect, disconnect, status } = useWebSocketWorker()

  const sessionId = useContextSelector(SessionDetailsContext, sd => sd?.id)
  const serverUri = `${wsProtocol()}://${getHost()}/session?sessionId=${sessionId}`
  const defaultClientName = useContextSelector(OptionsContext, o => o.getOptionValue('DefaultClientName'))
  const [name, setName] = useState(defaultClientName)
  const disconnectSound = useContextSelector(OptionsContext, o => o.getOptionValue('Disconnect_Sound'))
  const debug = useContextSelector(OptionsContext, o => o.getOptionValue('Debug'))

  const statusString = getStatusString(status)
  const statusColor = getStatusColor(status)
  const remoteIcon = remoteClient && <svg width={32} height={32}>
    <Icon iconType={remoteClient.icon} color={remoteClient.color} animated={false} width={32} height={32}/>
  </svg>
  const icon = emulator ? <PC fill={statusColor} style={{ width: 24, height: 24, margin: 4 }}/> :
    <SNES style={{ width: 32, height: 32 }}/>

  const connectOrDisconnect = () => {
    if (status.connectedToSnes > 0) {
      disconnect()
    } else {
      connect(name, localClient, serverUri, debug, disconnectSound)
    }
  }

  return <div className="d-flex" style={{ borderColor: statusColor }}>
    <div className="me-2" title={name || localClient.id}>{remoteIcon || icon}</div>
    <div className="input-group input-group-sm">
      <input type="text" size={24} className="form-control form-control-sm" placeholder={localClient.id} value={name}
        onChange={e => setName(e.target.value)} disabled={status.connectedToSnes > 0}/>
      <button className="btn btn-sm btn-dark w-50" style={{ color: statusColor }} onClick={connectOrDisconnect}>
        {statusString}
      </button>
    </div>
  </div>
})
