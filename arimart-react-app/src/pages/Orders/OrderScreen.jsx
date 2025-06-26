import React from 'react'
import Header from '../../components/Header/Header'
import OrdersPage from '../../components/Orders/OrdersPage'

function OrderScreen() {
  return (
    <div className='mb-20'>
        <Header title="Your Orders" setbaricon={false} setcarticon={false} />
        <OrdersPage/>
    </div>
  )
}

export default OrderScreen