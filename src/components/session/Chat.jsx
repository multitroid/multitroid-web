import React, { useEffect, useState } from 'react'
import ClientContext from '../../context/ClientContext'
import WebSocketContext from '../../context/WebSocketContext'
import { useContextSelector } from 'use-context-selector'
import OptionsContext from '../../context/OptionsContext'


const colors = [
  {
    id: 7,
    name: 'Yellow',
    html: 'gold'
  },
  {
    id: 2,
    name: 'Pink',
    html: 'hotpink'
  },
  {
    id: 3,
    name: 'Dark blue',
    html: 'rgb(33, 34, 71)'
  },
  {
    id: 4,
    name: 'Green',
    html: 'limegreen'
  },
  {
    id: 5,
    name: 'Pinkish brownish',
    html: 'rgb(149, 106, 122)'
  },
  {
    id: 6,
    name: 'Orange',
    html: 'darkorange'
  }
]

export default React.memo(() => {

  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)
  const sendMessage = useContextSelector(WebSocketContext, ws => ws.sendMessage)
  const connectedClients = useContextSelector(ClientContext, c => c.clients)
  const [text, setText] = useState('')
  const [color, setColor] = useState(7)
  const clients = connectedClients ? Object.values(connectedClients) : []
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id)
  const disabled = !text || text === ''

  useEffect(() => {
    const clients = connectedClients ? Object.values(connectedClients) : []
    if (!clients.map(c => c.id).includes(selectedClientId)) {
      setSelectedClientId(undefined)
    }
  }, [connectedClients, selectedClientId])

  const sendChatMessage = () => {
    const message = {
      type: 'Chat',
      message: text,
      palette: color
    }
    if (selectedClientId) {
      message.to = selectedClientId
    }
    sendMessage(message)
    setText('')
  }

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      sendChatMessage()
    }
  }

  return <div className="p-4 position-relative">
    <div className="position-absolute top-0 end-0 me-2" style={{ zIndex: 100 }}>
      <span title="Close" className="ms-2 align-middle">
        <span className="fmt fs-4 align-middle hand text-secondary"
          onClick={() => setOptionValue('CHAT', false)}>
          &#10007;
        </span>
      </span>
    </div>

    <div className="mb-3">
      <label htmlFor="text" className="form-label">Chat message in-game</label>
      <input
        id="text"
        type="text"
        maxLength={7}
        className="form-control"
        placeholder="Text to send (max. 7 characters)"
        value={text}
        onKeyPress={onKeyPress}
        onChange={e => setText(e.target.value)}/>
    </div>

    <div className="mb-3">
      <label htmlFor="text" className="form-label">Recipient</label>
      <select
        id="chatTo"
        className="form-select"
        value={selectedClientId}
        onKeyPress={onKeyPress}
        onChange={(e) => setSelectedClientId(e.target.value)}>
        <option value="">All</option>
        {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
      </select>
    </div>

    <div className="mb-4">
      <label htmlFor="color" className="form-label">Color</label>
      <select
        id="color"
        className="form-select"
        style={{
          fontWeight: 'bold',
          color: colors.find(c => c.id === Number(color))?.html || 'white'
        }}
        value={color}
        onKeyPress={onKeyPress}
        onChange={(e) => setColor(e.target.value)}>
        {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
    </div>

    <div>
      <button
        className="w-100 btn btn-primary"
        type="button"
        disabled={disabled}
        onClick={sendChatMessage}>
        {disabled ? 'Input text first' : 'Send'}
      </button>
    </div>
  </div>
})
