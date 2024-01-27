import React from 'react'

export default React.memo(({ children }) => {

  return <div className="border position-relative bg-black">
    {children}
  </div>
})
