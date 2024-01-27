import React from 'react'
import RangeContext from '../../context/RangeContext'
import ConsumableContext from '../../context/ConsumableContext'
import OptionsContext, { defaultOptions } from '../../context/OptionsContext'
import { checkCondition, gates } from '../../util/gomode'
import { useContextSelector } from 'use-context-selector'


const goModeColor = (goMode) => goMode ? 'text-success' : 'text-danger'
const checkMark = (checked) => {
  return <strong className={`d-inline-block text-center ${goModeColor(checked)}`} style={{ width: '1.5rem' }}>
    {checked ? <span>&#10003;</span> : <span>&#10008;</span>}
  </strong>
}

export default React.memo(() => {

  const getOptionValue = useContextSelector(OptionsContext, o => o.getOptionValue)
  const ranges = useContextSelector(RangeContext, ranges => ranges)
  const consumables = useContextSelector(ConsumableContext, consumables => consumables)

  if (!getOptionValue || !ranges || !consumables) {
    return <div className="p-2 text-secondary">
      Go-mode checklist
    </div>
  }

  return <div className="p-2">
    <h4>Randomizer go-mode reference</h4>
    <div className="pb-2 text-secondary">(Add/remove tricks in options)</div>
    <div>
      {gates.map(gate => {
        const vanillaGoMode = gate.vanilla(ranges, consumables)
        const optionsGoMode = !!gate.options.find(optionName => checkCondition(getOptionValue, ranges, consumables, optionName))
        const gateGoMode = vanillaGoMode || optionsGoMode
        return <div key={gate.name}>
          <div className={`fs-5 ${goModeColor(gateGoMode)}`}><strong>{checkMark(gateGoMode)}{gate.name}</strong></div>

          <div><small>{checkMark(vanillaGoMode)}Vanilla <span className="text-secondary">({gate.vanillaLabel})</span></small></div>

          {gate.options
            .filter(optionName => getOptionValue(optionName))
            .map(optionName => {
              const optionGoMode = checkCondition(getOptionValue, ranges, consumables, optionName)
              const option = defaultOptions[optionName]
              return <div key={optionName}>
                <small>{checkMark(optionGoMode)}{option.label}&nbsp;{option.label2 ? <span className="text-secondary">{`(${option.label2})`}</span> : ''}</small>
              </div>
            })}

          <div className="mb-3"/>
        </div>
      })}
    </div>
  </div>
})
