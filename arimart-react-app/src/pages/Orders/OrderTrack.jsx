import React from 'react'
import Header from '../../components/Header'
import OrderTracking from '../../components/Orders/OrderTracking'

function OrderTrack() {
  return (
    <div className='mb-20'>
        <Header title="Track Your Order" setbaricon={false} setcarticon={false} />
        <OrderTracking/>
    </div>
  )
}

export default OrderTrack