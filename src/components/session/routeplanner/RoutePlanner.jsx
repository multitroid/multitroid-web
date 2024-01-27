import React, { Fragment, useState } from 'react'
import { useLocalStorage } from '../../../hooks/LocalStorage'
import RangeContext from '../../../context/RangeContext'
import { defaultRoutePlannerConfig } from './config'
import { useContextSelector } from 'use-context-selector'
import ClientContext from '../../../context/ClientContext'
import { ingameFromValue } from '../../../snes/gamestate'
import OptionsContext from '../../../context/OptionsContext'
import { parse } from 'query-string'


const checkTriggeredBitDescriptorRoutePoint = (routePoint, ranges) => {
  const range = ranges[routePoint.rangeName]
  const bitDescriptor = range?.bitDescriptors?.find(bd => bd.index === routePoint.index && bd.mask === routePoint.mask)
  if (bitDescriptor) {
    const { index, mask } = bitDescriptor
    const triggered = (range.range[index] & mask) !== 0
    if (triggered) {
      return true
    }
  }
  return false
}

function textToSpeechRoutePoint(nextRoutePoint) {
  const utterance = new SpeechSynthesisUtterance(`Next objective: ${nextRoutePoint.name}`)
  window.speechSynthesis.speak(utterance)
}

export default React.memo(({ setConfiguring }) => {
  const query = parse(location.search)
  const panelParam = query.panel === 'routeplanner' || query.panel === 'routeplanner_next_objective'
  const onlyNextObjective = query.panel === 'routeplanner_next_objective'
  const [expanded, setExpanded] = useLocalStorage('routePlannerExpanded', true)
  const [routePlannerConfig] = useLocalStorage('routePlannerConfig', defaultRoutePlannerConfig)
  const getOptionValue = useContextSelector(OptionsContext, o => o.getOptionValue)
  const routePoints = routePlannerConfig.routePoints
  const connectedClients = useContextSelector(ClientContext, c => c.clients)
  const ingameClients = Object.values(connectedClients)
    .filter(client => {
      return client.GameState ? ingameFromValue(client.GameState) : false
    }).length

  const showRoutePoints = !onlyNextObjective && expanded

  const ranges = useContextSelector(RangeContext, r => r)

  const triggeredRoutePoints = routePoints
    .filter(routePoint => checkTriggeredBitDescriptorRoutePoint(routePoint, ranges))

  const nextRoutePoint = triggeredRoutePoints.length < routePoints.length
    ? routePoints.find(rp => !triggeredRoutePoints.includes(rp))
    : null

  const [nextUpSpeech, setNextUpSpeech] = useState(nextRoutePoint?.name)

  if (!panelParam && routePlannerConfig.tts && nextRoutePoint && nextUpSpeech !== nextRoutePoint.name && window.speechSynthesis) {
    setNextUpSpeech(nextRoutePoint.name)
    if (ingameClients > 0) {
      if (getOptionValue('TextToSpeech')) {
        setTimeout(() => {
          textToSpeechRoutePoint(nextRoutePoint)
        }, 500)
      } else {
        textToSpeechRoutePoint(nextRoutePoint)
      }
    }
  }

  return <div className="p-4">
    {!panelParam && <div className="mb-1">
      <span>Route Planner</span>
      <span className="text-secondary ms-2 hand" onClick={() => setExpanded(!expanded)}>
        {expanded ? '(hide route points)' : '(show all route points)'}
      </span>
    </div>}
    {routePoints.length === 0 && setConfiguring && !panelParam && <div className="text-secondary">
      (Add some route points in the <span className="hand text-primary"
      onClick={() => setConfiguring(true)}>config</span>)
    </div>}
    {routePoints.length === 0 && panelParam && <div className="text-secondary">
      (No route points configured)
    </div>}
    {showRoutePoints && <div className="route-planner-grid mb-2">
      {routePoints.map((routePoint) => {
        const triggered = triggeredRoutePoints.includes(routePoint)
        return <Fragment key={routePoint.id}>
          <div>{checkMark(triggered)}</div>
          <div>{routePoint.name}</div>
        </Fragment>
      })}
    </div>}

    {nextRoutePoint && <>
      {(showRoutePoints || !panelParam) && <hr/>}
      <div className="text-secondary">Next Objective</div>
      <div className="fs-1">{nextRoutePoint.name}</div>
      {nextRoutePoint.note && <div className="fs-4 text-secondary mt-2">{nextRoutePoint.note}</div>}
    </>}

  </div>

})

const checkMark = (checked) => {
  return <strong className={`d-inline-block text-centered ${checkMarkColor(checked)}`} style={{ width: '1rem' }}>
    {checked ? <span>&#10003;</span> : <span>&#10008;</span>}
  </strong>
}

const checkMarkColor = (checked) => checked ? 'text-success' : 'text-danger'
