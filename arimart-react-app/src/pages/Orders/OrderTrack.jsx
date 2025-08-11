import React from 'react'
import Header from '../../components/Header/Header'
import OrderTracking from '../../components/Orders/OrderTracking'

function OrderTrack() {
  return (
    <div className=''>
        {/* <Header title="Track Your Order" setbaricon={false} setcarticon={false} /> */}
        <OrderTracking/>
    </div>
  )
}

export default OrderTrack