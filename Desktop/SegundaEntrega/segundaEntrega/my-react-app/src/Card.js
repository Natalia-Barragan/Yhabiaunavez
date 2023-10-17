import react from 'react'

import capa from '../photos/capa.jpeg'

function Card() {
  return (
    <div className='card'>
      <img src={capa} alt=''/>
      <div className='card-body'>
        <h3 className='card-title'>titulo</h3>
        <p className='card-text-secondary'>algo</p>        
      </div>
    </div>
  )
}