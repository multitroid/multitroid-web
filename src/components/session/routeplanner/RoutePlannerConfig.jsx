import React, { Fragment, useRef, useState } from 'react'
import { useLocalStorage } from '../../../hooks/LocalStorage'
import { v4 as uuid } from 'uuid'
import BitDescriptorRoutePoint from './type/BitDescriptorRoutePoint'
import { defaultRoutePlannerConfig } from './config'
import { ROUTE_PRESETS } from './presets/presets'

export default React.memo(() => {

  const fileInputRef = useRef()
  const [routePlannerConfig, setRoutePlannerConfig] = useLocalStorage('routePlannerConfig', defaultRoutePlannerConfig)
  const routePoints = routePlannerConfig.routePoints
  const [preset, setPreset] = useState('100_2_1')

  const addRoutePoint = (newRotuePoint) => {
    setRoutePlannerConfig({
      ...routePlannerConfig,
      routePoints: [...routePoints.map(existingRotuePoint => ({
        ...existingRotuePoint
      })), {
        ...newRotuePoint,
        id: uuid(),
      }]
    })
  }

  const removeRoutePoint = (id) => {
    setRoutePlannerConfig({
      ...routePlannerConfig,
      routePoints: routePoints
        .filter(routePoint => routePoint.id !== id)
        .map(routePoint => ({
          ...routePoint,
        }))
    })
  }

  function moveRoutePoint(from, to) {
    const newArray = [...routePlannerConfig.routePoints]
    const f = newArray.splice(from, 1)[0]
    newArray.splice(to, 0, f)
    setRoutePlannerConfig({
      ...routePlannerConfig,
      routePoints: newArray
    })
  }

  const downloadRoute = () => {
    const routePointsWithoutId = routePlannerConfig.routePoints.map(rp => ({
      ...rp,
      id: undefined
    }))
    const jsonData = JSON.stringify({ routePoints: routePointsWithoutId }, null, 2)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([jsonData], { type: 'application/json' }))
    a.download = 'route.json'
    a.click()
  }

  const uploadRoute = (e) => {
    if (e.target.files?.length > 0) {
      const fileReader = new FileReader()
      fileReader.onload = (fe) => {
        try {
          const jsonData = JSON.parse(fe.target.result)
          if (jsonData.routePoints) {
            setRoutePlannerConfig({
              ...routePlannerConfig,
              routePoints: jsonData.routePoints.map(rp => ({
                ...rp,
                id: uuid()
              }))
            })
          } else {
            window.alert('Could not find route points in file')
          }
        } catch (ex) {
          window.alert('Error while importing route points: ' + ex)
        }
        e.target.value = null
      }
      fileReader.onerror = (error) => {
        window.alert(error)
      }
      fileReader.readAsText(e.target.files[0])
    }
  }

  const loadPreset = () => {
    const presetJson = ROUTE_PRESETS[preset].json
    setRoutePlannerConfig({
      ...presetJson,
      routePoints: presetJson.routePoints.map(rp => ({
        ...rp,
        id: uuid()
      }))
    })
  }

  const clearRoute = () => {
    if (confirm('Are you sure you want to remove all the route points?')) {
      setRoutePlannerConfig({
        routePoints: []
      })
    }
  }

  return <div className="p-4">
    <div className="mb-1">Route Planner</div>
    <div className="route-planner-grid mb-2">
      {routePoints.map((routePoint, i) => {
        const canGoUp = i > 0
        const canGoDown = i < routePoints.length - 1
        return <Fragment key={routePoint.id}>
          <div>
            {canGoUp ?
              <span className="hand text-secondary me-1" onClick={() => moveRoutePoint(i, i - 1)}>&#8593;</span> :
              <span className="text-disabled me-1">&#8593;</span>}
            {canGoDown ?
              <span className="hand text-secondary me-1" onClick={() => moveRoutePoint(i, i + 1)}>&#8595;</span> :
              <span className="text-disabled me-1">&#8595;</span>}
            <span className="hand text-danger me-2" onClick={() => removeRoutePoint(routePoint.id)}>&#10007;</span>
          </div>
          <div>
            {routePoint.name}
            {routePoint.note && <span className="text-secondary ms-2">{routePoint.note}</span>}
          </div>
        </Fragment>
      })}
    </div>

    <hr/>

    <BitDescriptorRoutePoint addRoutePoint={addRoutePoint}/>

    <hr/>

    <div className="form-check">
      <input className="form-check-input" id="autoReset" type="checkbox" checked={routePlannerConfig.tts || false}
        onChange={() => setRoutePlannerConfig({ ...routePlannerConfig, tts: !routePlannerConfig.tts })}/>
      <label className="form-check-label" htmlFor="autoReset">
        Text-to-speech for next objective
      </label>
    </div>

    <hr/>

    <div className="mt-2">
      <button type="button" className="btn btn-sm btn-secondary me-2 mb-2" onClick={downloadRoute}>Save route to file
      </button>
      <button type="button" className="btn btn-sm btn-secondary me-2 mb-2"
        onClick={() => fileInputRef.current.click()}>Load
        route from file
      </button>
      <button type="button" className="btn btn-sm btn-secondary me-2 mb-2" onClick={clearRoute}>
        Clear route
      </button>
      <div className="input-group input-group-sm">
        <select className="form-select" value={preset} onChange={e => setPreset(e.target.value)}>
          <option disabled>Select route preset...</option>
          {Object.entries(ROUTE_PRESETS).map(([key, value]) => <option key={key} value={key}>{value.name}</option>)}
        </select>
        <button className="btn btn-secondary" type="button" onClick={loadPreset}>Load preset</button>
      </div>
    </div>

    <input ref={fileInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={uploadRoute}/>

  </div>

})
