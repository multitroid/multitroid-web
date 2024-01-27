import RangeContext from '../../../../context/RangeContext'
import { useContextSelector } from 'use-context-selector'

export default ({ rangeName }) => {
  const ranges = useContextSelector(RangeContext, r => r)
  return ranges[rangeName].bitDescriptors
    .map((bd, i) => {
      const value = rangeName + '/' + bd.index + '/' + bd.mask + '/' + bd.name
      return <option key={i} value={value}>{bd.name}</option>
    })
}
