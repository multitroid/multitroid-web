import { MESSAGE_TYPE } from '../snes/worker'
import { useCallback, useEffect, useRef, useState } from 'react'

const defaultStatus = {
  sync: 0,
  connectedToSnes: 0,
  connectedToServer: 0
}

const createWorker = (setStatus) => {
  const worker = new Worker(new URL('../snes/worker.js', import.meta.url))
  worker.onerror = (e) => {
    console.error(e)
    worker.terminate()
  }
  worker.onmessage = (e) => {
    if (e.data.type === MESSAGE_TYPE.STATUS) {
      setStatus((oldStatus) => ({
        ...oldStatus,
        ...e.data.data
      }))
    } else if (e.data.type === MESSAGE_TYPE.PLAY_AUDIO) {
      new Audio(e.data.data).play()
    } else if (e.data.type === MESSAGE_TYPE.ALERT) {
      alert(e.data.data)
    }
  }
  return worker
}

export const useWebSocketWorker = () => {

  const mounted = useRef(true)
  const [status, setStatus] = useState(defaultStatus)
  const [worker, setWorker] = useState(null)

  const disconnect = useCallback(() => {
    worker?.postMessage({
      type: MESSAGE_TYPE.CLOSE
    })
    setTimeout(() => worker?.terminate(), 1000)
    setStatus(defaultStatus)
  }, [worker])

  useEffect(() => () => {
    mounted.current = false
  }, [])

  useEffect(() => {
    return () => {
      if (!mounted.current) {
        disconnect()
      }
    }
  }, [disconnect])

  const connect = (name, localClient, serverUri, debug, disconnectSound) => {
    const newWorker = createWorker(setStatus)
    setWorker(newWorker)
    newWorker.postMessage({
      type: MESSAGE_TYPE.INIT,
      name,
      localClient,
      serverUri,
      debug,
      disconnectSound
    })
  }

  return {
    connect,
    disconnect,
    status
  }

}
