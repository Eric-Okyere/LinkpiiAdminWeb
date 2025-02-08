import React from 'react'
import "../components/Loader.css"

const Loader = () => {
  return (
   
<div className="loader">
  <span></span>

  <div id="dot-1" className="dot"></div>
  <div id="dot-2" className="dot"></div>
  <div id="dot-3" className="dot"></div>
  <div id="dot-4" className="dot"></div>
  <div id="dot-5" className="dot"></div>
  <h1 className='text-white'>Loading........</h1>
</div>

  )
}

export default Loader