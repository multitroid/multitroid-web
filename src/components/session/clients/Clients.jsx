import React from 'react'
import { v4 as uuid } from 'uuid'
import LocalClient from './LocalClient'
import OptionsContext from '../../../context/OptionsContext'
import { OBSERVER } from '../../../main'
import SessionDetailsContext from '../../../context/SessionDetailsContext'
import RemoteClient from './RemoteClient'
import ClientContext from '../../../context/ClientContext'
import { useAsync } from 'react-async-hook'
import { useContextSelector } from 'use-context-selector'


export default React.memo(({ setShowOptions }) => {

  const showLocalClients = useContextSelector(SessionDetailsContext, sd => sd?.readOnlyId) && !OBSERVER
  const sd2snesIp = useContextSelector(OptionsContext, o => o.getOptionValue('SD2SNES_URI'))
  const sd2snesPort = useContextSelector(OptionsContext, o => o.getOptionValue('SD2SNES_Port'))
  const sd2snesUri = sd2snesIp && sd2snesPort && `ws://${sd2snesIp}:${sd2snesPort}`

  const sd2snesAsync = useAsync(fetchAndMapClients, [sd2snesUri], {
    executeOnMount: showLocalClients && sd2snesUri,
    executeOnUpdate: showLocalClients && sd2snesUri
  })
  const localClients = sd2snesAsync.result || []

  const connectedClients = useContextSelector(ClientContext, c => c.clients)
  const webIds = localClients.map(c => c.webId)
  const remoteClients = Object.values(connectedClients)
    .filter(client => !webIds.includes(client.webId))

  return <div>
    {sd2snesAsync.loading &&
      <div className="alert alert-primary">
        Searching for SNES/emulators...
      </div>}
    {sd2snesAsync.error && <div className="alert alert-danger">
      Could not connect to SNI/QUsb2Snes. Please check that the address/port in&nbsp;
      <span className="link-light text-decoration-underline hand" onClick={setShowOptions}>options</span> is correct.
      Refreshing the webpage might also help.
    </div>}
    {sd2snesAsync.result && sd2snesAsync.result.length === 0 && <div className="alert alert-warning">
      Connected successfully to SNI/QUsb2Snes, but could not find any SNES/emulators. Check if they show up under
      devices. Refreshing the webpage might also help.
    </div>}

    <div className="panel-grid">
      <div>
        {showLocalClients && localClients.map(localClient => <div key={localClient.id} className="mb-3">
          <LocalClient localClient={localClient}
            remoteClient={Object.values(connectedClients).find(c => c.webId === localClient.webId)}
            emulator={localClient.emulator}/>
        </div>)}

        {remoteClients.map(client => <div key={client.id} className="me-3 mb-3">
          <RemoteClient client={client}/>
        </div>)}
      </div>
    </div>
  </div>
})

const fetchAndMapClients = async (uri) => fetchClients(uri)
  .then(data => data.Results.map(client => ({
    uri: uri,
    id: client,
    webId: uuid(),
    emulator: false
  })))

const fetchClients = (uri) => {
  const timeout = 5000
  return new Promise((resolve, reject) => {
      const webSocket = new WebSocket(uri)

      const timer = setTimeout(() => {
        reject(new Error('connect timeout'))
        webSocket.close()
      }, timeout)

      webSocket.onopen = () => {
        clearTimeout(timer)
        webSocket.send(JSON.stringify({
          Opcode: 'DeviceList'
        }))
      }

      webSocket.onmessage = msg => {
        const data = JSON.parse(msg.data)
        webSocket.close()
        resolve(data)
      }

      webSocket.onerror = () => {
        if (webSocket.readyState < 2) {
          webSocket.close()
        }
        reject('Websocket error')
      }
    }
  )
}
