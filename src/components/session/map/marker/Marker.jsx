import React from 'react'
import Icon from '../icon/Icon'
import OptionsContext from '../../../../context/OptionsContext'
import { useContextSelector } from 'use-context-selector'
import { parse } from 'query-string'

export default React.memo(({ color, x, y, type, pulse }) => {

  const sizeOption = useContextSelector(OptionsContext, o => o.getOptionValue('MAP_MARKER_SIZE')) || 32
  const query = parse(location.search)
  const sizeParam = query.panel && query?.markerSize ? parseInt(query?.markerSize, 10) : undefined
  const size = sizeParam || sizeOption || 32

  return <g transform={'translate(' + (x * 8 + 4 - (size / 2)) + ',' + (y * 8 + 4 - (size / 2)) + ')'}>
    <Icon iconType={type} color={color} animated={pulse} width={size} height={size}/>
  </g>

})

