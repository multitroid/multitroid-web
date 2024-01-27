import BitDescriptorOptions from './BitDescriptorRoutePointOptions'
import { Fragment, useState } from 'react'


const rangeNames = ['EVENT', 'EQUIPMENT', 'ITEM', 'DOOR']

export default ({ addRoutePoint }) => {
  const [item, setItem] = useState('')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  const onSelect = e => {
    setItem(e.target.value)
  }

  const onSubmit = () => {
    if (item) {
      const [rangeName, index, mask, bitName] = item?.split('/')
      const routePointName = (name && name !== '') ? name : bitName
      const routePoint = {
        name: routePointName,
        note: note || '',
        type: 'bitDescriptor',
        rangeName: rangeName,
        index: Number(index),
        mask: Number(mask),
      }
      addRoutePoint(routePoint)
      setName('')
      setNote('')
    }
  }

  const onKeyPress = e => {
    if (e.key === 'Enter') {
      onSubmit()
    }
  }

  return <div>
    <div className="mb-2">
      <div className="mb-2">
        <label className="form-label">Add route point</label>
        <select className="form-select form-select-sm" value={item} onChange={onSelect}>
          <option value="">Route point at... (select one)</option>
          {rangeNames.map(rangeName => {
            return <Fragment key={rangeName}>
              <option disabled>---- {rangeName} ----</option>
              <BitDescriptorOptions rangeName={rangeName}/>
            </Fragment>
          })}
        </select>
      </div>
      <div className="mb-2">
        <input value={name} onChange={(e) => setName(e.target.value)} type="text"
          className="form-control form-control-sm" placeholder="Name (optional)" onKeyPress={onKeyPress}/>
      </div>
      <div className="mb-2">
        <input value={note} onChange={(e) => setNote(e.target.value)} type="text"
          className="form-control form-control-sm" placeholder="Note that will display underneath (optional)" onKeyPress={onKeyPress}/>
      </div>
      <button type="button" className="btn btn-sm btn-secondary" onClick={onSubmit} disabled={!item}>
        Add
      </button>
    </div>

  </div>
}
