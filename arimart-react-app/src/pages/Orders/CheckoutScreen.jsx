import React from 'react'
import Header from '../../components/Header'
import CheckoutPage from '../../components/Orders/CheckoutPage'

function CheckoutScreen() {
  return (
    <div className='mb-20'>
        <Header title="Checkout" setbaricon={false} setcarticon={false} />
        <CheckoutPage/>
    </div>
  )
}

export default CheckoutScreen