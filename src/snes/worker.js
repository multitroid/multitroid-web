import { onServerMessage } from './communication'
import beep from '../sound/beep.mp3'
import { parseBlobData } from './read'

export const MESSAGE_TYPE = {
  INIT: 'INIT',
  CLOSE: 'CLOSE',
  STATUS: 'STATUS',
  PLAY_AUDIO: 'PLAY_AUDIO',
  ALERT: 'ALERT'
}

self.webSockets = {}

self.onmessage = (e) => {
  const data = e.data

  switch (data.type) {
    case MESSAGE_TYPE.INIT: {
      self.webSockets.client = undefined
      self.webSockets.server = undefined
      postMessage({
        type: MESSAGE_TYPE.STATUS,
        data: {
          connectedToSnes: 1,
          sync: 0
        }
      })
      const { name, localClient, serverUri, debug, disconnectSound } = data
      const snesWebsocket = new WebSocket(localClient.uri)
      snesWebsocket.id = localClient.id
      snesWebsocket.name = name || 'Unnamed player'
      snesWebsocket.readQueue = []
      snesWebsocket.writeQueue = []
      snesWebsocket.closeRequested = false
      snesWebsocket.onopen = () => {
        postMessage({
          type: MESSAGE_TYPE.STATUS,
          data: {
            connectedToSnes: 2
          }
        })
        snesWebsocket.send(JSON.stringify({
          Opcode: 'Name',
          Space: 'SNES',
          Operands: ['Multitroid ' + name]
        }))
        snesWebsocket.send(JSON.stringify({
          Opcode: 'Attach',
          Space: 'SNES',
          Operands: [localClient.id]
        }))
        postMessage({
          type: MESSAGE_TYPE.STATUS,
          data: {
            connectedToServer: 1
          }
        })

        const serverWebsocket = new WebSocket(serverUri)

        const webSockets = { serverWebsocket, snesWebsocket }

        serverWebsocket.onopen = () => {
          serverWebsocket.send(JSON.stringify({
            type: 'Hello',
            client: 'Multitroid-Player',
            revision: 0,
            game: true,
            name: snesWebsocket.name,
            webId: localClient.webId
          }))
          postMessage({
            type: MESSAGE_TYPE.STATUS,
            data: {
              connectedToServer: 2
            }
          })
        }
        serverWebsocket.onmessage = async msg => {
          await onServerMessage(msg.data, webSockets, () => {
            try {
              if (snesWebsocket.readyState === snesWebsocket.OPEN) {
                snesWebsocket.close()
              }
            } catch (err) {
              console.error(err)
            }
            try {
              if (serverWebsocket.readyState === serverWebsocket.OPEN) {
                serverWebsocket.close()
              }
            } catch (err) {
              console.error(err)
            }
          })
        }
        serverWebsocket.onclose = e => {
          if (debug) {
            postMessage({
              type: MESSAGE_TYPE.ALERT,
              data: `Disconnect between webpage and server:\n\nCode: ${JSON.stringify(e.code)}\nReason: ${JSON.stringify(e.reason)}\nWas clean: ${JSON.stringify(e.wasClean)}`
            })
          }
          if (e.code !== 1000) {
            if (disconnectSound) {
              postMessage({
                type: MESSAGE_TYPE.PLAY_AUDIO,
                data: beep
              })
            }
          }
          postMessage({
            type: MESSAGE_TYPE.STATUS,
            data: {
              connectedToServer: 0
            }
          })
          if (self.webSockets.client?.readyState < 2) {
            self.webSockets.client.close()
          }
        }
        self.webSockets.server = serverWebsocket
      }
      snesWebsocket.onmessage = msg => {
        const data = msg.data
        if (data instanceof Blob || toString.call(data) === '[object Blob]') {
          parseBlobData(snesWebsocket, data)
        }
      }
      snesWebsocket.onclose = e => {
        if (debug) {
          postMessage({
            type: MESSAGE_TYPE.ALERT,
            data: `Disconnect between webpage and snes:\n\nCode: ${JSON.stringify(e.code)}\nReason: ${JSON.stringify(e.reason)}\nWas clean: ${JSON.stringify(e.wasClean)}`
          })
        }
        if (e.code !== 1000) {
          if (disconnectSound) {
            postMessage({
              type: MESSAGE_TYPE.PLAY_AUDIO,
              data: beep
            })
          }
        }
        postMessage({
          type: MESSAGE_TYPE.STATUS,
          data: {
            connectedToSnes: 0,
            sync: 0
          }
        })
        if (self.webSockets.server?.readyState < 2) {
          self.webSockets.server.close()
        }
      }
      self.webSockets.client = snesWebsocket
      break
    }
    case MESSAGE_TYPE.CLOSE: {
      if (self.webSockets.client) {
        self.webSockets.client.closeRequested = true
      }
      if (self.webSockets.server?.readyState < 2) {
        self.webSockets.server.close()
      }
      if (self.webSockets.client?.readyState < 2) {
        self.webSockets.client.close()
      }
      break
    }
    default:
      break
  }
}
