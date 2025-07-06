import React from 'react'
import Header from '../../components/Header/Header'
import Trackorder from '../../components/Orders/Trackorder'

function Trackorders() {
  return (
    <div className=''>
        <Header title="Track Your Order" setbaricon={false} setcarticon={false} />
        <Trackorder/>
    </div>
  )
}

export default Trackorders