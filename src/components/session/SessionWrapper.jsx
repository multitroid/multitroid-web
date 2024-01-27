import React, { useCallback, useEffect, useState } from 'react'
import update from 'immutability-helper'
import { parse } from 'query-string'
import { useNavigate, useParams } from 'react-router'
import { getHost, wsProtocol } from '../../util/url'
import SessionDetailsContext from '../../context/SessionDetailsContext'
import Spinner from '../Spinner'
import ConsumableContext from '../../context/ConsumableContext'
import RangeContext from '../../context/RangeContext'
import ClientContext from '../../context/ClientContext'
import { tileTypesThatCount } from '../../util/tile'
import OptionsContext, { defaultOptions } from '../../context/OptionsContext'
import { getOptionFromLocalStorage, setOptionInLocalStorage } from '../../util/localstorage'
import { iconFromName } from '../../util/icon'
import BingoContext from '../../context/BingoContext'
import ChallengeContext from '../../context/ChallengeContext'
import WebSocketContext from '../../context/WebSocketContext'
import { DELAY } from '../../main'

import '../../style/session.scss'
import '../../style/fun.css'
import '../../style/marker.css'
import '../../style/tiles.css'
import loadable from '@loadable/component'


const hello = (panel) => JSON.stringify({
  type: 'Hello',
  client: 'Multitroid-Web',
  name: `Multitroid-Web${panel ? ('-Panel-' + panel) : ''}`,
  revision: 0,
  game: false
})

const initialBingo = {
  id: '',
  bingo: false,
  bingosNeeded: null,
  tiles: {}
}

const initialChallenge = {
  complete: false,
  objectives: {}
}

const Status = loadable(() => import('./status/Status'))
const Tracker = loadable(() => import('./tracker/Tracker'))
const BigMap = loadable(() => import('./map/BigMap'))
const RoutePlanner = loadable(() => import('./routeplanner/RoutePlanner'))
const Bingo = loadable(() => import('./Bingo'))
const Session = loadable(() => import('./Session'))

export const popoutPanels = {
  status: {
    name: 'Energy, ammo and tiles',
    filterFn: () => true,
    comp: <Status/>
  },
  tracker: {
    name: 'Tracker',
    filterFn: () => true,
    comp: <Tracker/>
  },
  map: {
    name: 'Map',
    filterFn: () => true,
    comp: <BigMap/>,
    defaultParams: '&color_visited=D41C82&color_unvisited=1D2573&pulse=true&markerSize=16'
  },
  map_zoom: {
    name: 'Map (zoomed)',
    filterFn: () => true,
    comp: <BigMap/>,
    defaultParams: '&color_visited=D41C82&color_unvisited=1D2573&pulse=true&markerSize=16'
  },
  routeplanner: {
    name: 'Route planner with route points',
    filterFn: () => true,
    comp: <RoutePlanner/>
  },
  routeplanner_next_objective: {
    name: 'Route planner with only next objective',
    filterFn: () => true,
    comp: <RoutePlanner/>
  },
  bingo: {
    name: 'Bingo',
    filterFn: (mode) => mode === 'BINGO' || mode === 'LOCKOUT_BINGO',
    comp: <Bingo/>
  }
}

export default React.memo(() => {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const query = parse(location.search)

  const [optionsRefresh, setOptionsRefresh] = useState({})
  const [ws, setWs] = useState(null)
  const [sessionDetails, setSessionDetails] = useState(null)
  const [consumables, setConsumables] = useState({})
  const [ranges, setRanges] = useState({})
  const [clients, setClients] = useState({})
  const [bingo, setBingo] = useState(initialBingo)
  const [challenge, setChallenge] = useState(initialChallenge)

  const sendMessage = useCallback(message => {
    ws.send(JSON.stringify(message))
  }, [ws])

  let uri = `${wsProtocol()}://${getHost()}/session?sessionId=`
  if (sessionId === 'new') {
    const modeParam = query.mode ? `&mode=${query.mode}` : ''
    const seedParam = query.seed ? `&seed=${query.seed}` : ''
    const intConfigParam = query.intConfig ? `&intConfig=${query.intConfig}` : ''
    uri += `new&rom=${query.rom}${modeParam}${seedParam}${intConfigParam}&cheat=${query.cheat}`
  } else {
    uri += sessionId
  }

  const getOptionValue = useCallback(name => {
    const option = optionsRefresh && defaultOptions[name]
    return getOptionFromLocalStorage(name, option.defaultValue)
  }, [optionsRefresh])

  const setOptionValue = useCallback((name, value) => {
    setOptionInLocalStorage(name, value)
    setOptionsRefresh({})
  }, [])

  const updateStatus = statusUpdate => {
    setClients(previousState => {
      const id = statusUpdate.id
      if (!previousState[id]) {
        return previousState
      }
      const statusType = statusUpdate.name
      if ((statusType === 'ScreenX' || statusType === 'ScreenY') && statusUpdate.value > 254) {
        return previousState
      }
      //Hold back any updates while in a door transition (keep the updates in the afterDoor object)
      if (statusType !== 'GameState' && (previousState[id].GameState === 0xB || previousState[id].GameState === 0x9)) {
        return {
          ...previousState,
          [id]: {
            ...previousState[id],
            afterDoor: {
              ...previousState[id].afterDoor,
              [statusType]: statusUpdate.value
            }
          }
        }
      }
      //Door transition ended - apply all held back updates
      else if (statusType === 'GameState' && statusUpdate.value === 0x8) {
        const afterDoor = previousState[id].afterDoor
        previousState[id].afterDoor = null
        return {
          ...previousState,
          [id]: {
            ...previousState[id],
            ...afterDoor,
            [statusType]: statusUpdate.value,
          }
        }
      }
      //Normal update
      else {
        return {
          ...previousState,
          [id]: {
            ...previousState[id],
            [statusType]: statusUpdate.value
          }
        }
      }
    })
  }

  const updateRange = range => {
    setRanges(previousState => {
      if (!previousState[range.name]) {
        console.log('(range update) Got range ' + range.name + ' but don\'t have a descriptor for it', previousState)
        return
      }
      return {
        ...previousState,
        [range.name]: {
          ...previousState[range.name],
          range: range.data
        }
      }
    })
  }

  const updateBit = (name, index, mask, value) => {
    setRanges(previousState => {
      if (!previousState[name]) {
        console.log('(bit update) Got range ' + name + ' but don\'t have a descriptor for it', previousState)
        return previousState
      }
      return update(previousState, {
        [name]: {
          range: {
            [index]: {
              $apply: prevValue => {
                if (value === 0) {
                  return prevValue &= ~mask
                } else {
                  return prevValue |= mask
                }
              }
            }
          }
        }
      })
    })
  }

  useEffect(() => {
    const webSocket = new WebSocket(uri)
    webSocket.pushWhenClosed = true
    webSocket.onopen = () => {
      webSocket.send(hello(query.panel))
    }
    webSocket.onmessage = msg => {
      if (DELAY > 0) {
        setTimeout(() => webSocket.processMessage(msg), DELAY)
      } else {
        webSocket.processMessage(msg)
      }
    }
    webSocket.processMessage = msg => {
      const data = JSON.parse(msg.data)
      switch (data.type) {
        case 'SessionDetails': {
          const add = (a, b) => a + b
          const tileCount = data.game.map.areas
            .map(area => area.map)
            .map(arrayOfArrays => arrayOfArrays.map(innerArray => innerArray
                .filter(tile => tileTypesThatCount.includes(tile >> 8))
                .length
              ).reduce(add, 0)
            )
            .reduce(add, 0)
          setSessionDetails({ ...data, tileCount })
          setRanges(previousState => {
            const newState = { ...previousState }
            data.game.rangeDescriptors.forEach(rd => {
              newState[rd.name] = rd
              rd.range = new Array(rd.length).fill(0)
              rd.bitDescriptors?.sort((a, b) => a.name > b.name ? 1 : -1)
            })
            return newState
          })
          if (sessionId !== data.id) {
            navigate(`/${data.id}`, { replace: true })
          }
          break
        }

        case 'InitialGameState':
          data.consumableUpdates.forEach(co => {
            setConsumables(previousState => ({ ...previousState, [co.name]: co }))
          })
          data.rangeUpdates.forEach(range => {
            updateRange(range)
          })
          data.statusUpdates.forEach(statusUpdate => {
            updateStatus(statusUpdate)
          })
          break

        case 'ClientList':
          setClients(previousState => {
            const missingClientIds = Object.keys(previousState)
              .filter(key => !data.clients.find(inClient => inClient.id === key))

            const newState = {}
            Object.keys(previousState)
              .filter(key => !missingClientIds.includes(key))
              .forEach(key => newState[key] = previousState[key])

            data.clients.forEach(client => {
              if (!newState[client.id]) {
                newState[client.id] = {
                  id: client.id,
                  webId: client.webId,
                  name: client.name,
                  color: client.color,
                  Room: -1,
                  ScreenX: -1,
                  ScreenY: -1,
                  GameState: -1,
                  icon: iconFromName(client.name)
                }
              }
            })
            return newState
          })
          break

        case 'RangeUpdate':
          updateRange(data)
          break

        case 'BitUpdate':
          updateBit(data.name, data.index, data.mask, data.value)
          break

        case 'StatusUpdate':
          updateStatus(data)
          break

        case 'ConsumableUpdate':
          setConsumables(previousState => ({ ...previousState, [data.name]: data }))
          break

        case 'Bingo':
          setBingo(data)
          break

        case 'Challenge':
          setChallenge(data)
          break

        case 'TextToSpeech': {
          if (window.speechSynthesis && getOptionValue('TextToSpeech')) {
            const utterance = new SpeechSynthesisUtterance(data.message)
            window.speechSynthesis.speak(utterance)
          }
          break
        }

        case 'ResetGameState':
          setConsumables({})
          setRanges(prevState => {
            const newState = {}
            Object.keys(prevState).forEach(key => {
              newState[key] = {
                ...prevState[key],
                range: new Array(prevState[key].length).fill(0)
              }
            })
            return newState
          })
          break
      }
    }
    webSocket.onclose = () => {
      if (webSocket.pushWhenClosed) {
        navigate('/')
      }
    }
    setWs(webSocket)
    return () => {
      webSocket.pushWhenClosed = false
      if (webSocket.readyState < 2) {
        webSocket.close()
      }
    }
  }, [navigate, query.panel, sessionId, uri]) // eslint-disable-line

  if (!sessionDetails || !ws || ws.readyState !== 1) {
    return <Spinner/>
  }

  return <WebSocketContext.Provider value={{ sendMessage }}>
    <OptionsContext.Provider value={{ getOptionValue, setOptionValue }}>
      <SessionDetailsContext.Provider value={sessionDetails}>
        <ConsumableContext.Provider value={consumables}>
          <BingoContext.Provider value={bingo}>
            <ChallengeContext.Provider value={challenge}>
              <RangeContext.Provider value={ranges}>
                <ClientContext.Provider value={{ clients, setClients }}>
                  {popoutPanels[query.panel]?.comp || <Session/>}
                </ClientContext.Provider>
              </RangeContext.Provider>
            </ChallengeContext.Provider>
          </BingoContext.Provider>
        </ConsumableContext.Provider>
      </SessionDetailsContext.Provider>
    </OptionsContext.Provider>
  </WebSocketContext.Provider>
})
