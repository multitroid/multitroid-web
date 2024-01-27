import React from 'react'
import { useContextSelector } from 'use-context-selector'
import OptionsContext, { defaultOptions } from '../../../context/OptionsContext'


export default React.memo(({ name }) => {

  const option = defaultOptions[name]
  const value = useContextSelector(OptionsContext, o => o.getOptionValue(name))
  const setOptionValue = useContextSelector(OptionsContext, o => o.setOptionValue)

  switch (option.type) {
    case 'input': {
      return (
        <div className="mb-3">
          <label className="me-2" htmlFor={name}> {option.label}</label>
          {option.label2 && <label className="text-secondary" htmlFor={name}>{option.label2}</label>}
          <input
            id={name}
            type="text"
            className="form-control mt-2"
            onChange={(e) => setOptionValue(name, e.target.value)}
            value={value}/>
        </div>
      )
    }
    case 'boolean': {
      return (
        <div className="mb-2 form-check">
          <input type="checkbox" className="form-check-input" id={name} checked={value}
            onChange={() => setOptionValue(name, !value)}/>
          <label htmlFor={name} className="form-check-label"> {option.label}</label>
          {option.label2 && <div>
            <label className="form-check-label text-secondary" htmlFor={name}>
              <small>{option.label2}</small>
            </label>
          </div>}
        </div>
      )
    }
    case 'sound': {
      return (
        <div className="mb-2 form-check">
          <input type="checkbox" className="form-check-input" id={name} checked={value}
            onChange={() => setOptionValue(name, !value)}/>
          <label htmlFor={name} className="form-check-label">{option.label}</label>
          {option.label2 && <label className="form-check-label" htmlFor={name}>&nbsp;{option.label2}</label>}
          <span className="ms-2 hand" onClick={() => new Audio(option.sound).play()}>&#9654;</span>
        </div>
      )
    }
    case 'select': {
      const selectOptions = []
      option.values.forEach((r, i) => {
        selectOptions.push(
          <option key={i} value={r.value}>{r.label}</option>
        )
      })
      const style = name.toLowerCase().includes('color') ? { color: value } : {}
      return (
        <div className="mb-3">
          <label htmlFor={name} className="form-label me-2">{option.label}</label>
          {option.label2 && <label className="form-label text-secondary" htmlFor={name}>{option.label2}</label>}
          <select id={name} className="form-select" style={style} defaultValue={value}
            onChange={(e) => setOptionValue(name, e.target.value)}>
            {selectOptions}
          </select>
        </div>
      )
    }
    default:
      return null
  }

})
