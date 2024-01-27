import React from 'react'
import Range from './Range'

const rangeNames = ['EQUIPMENT', 'EVENT', 'ITEM', 'DOOR']

export default React.memo(() => {

  return <>
    {rangeNames.map(rangeName => <Range key={rangeName} name={rangeName}/>)}
  </>

})
