import React from 'react'
import Header from '../../components/Header/Header'
import CheckoutPage from '../../components/Orders/CheckoutPage'

function CheckoutScreen() {
  return (
    <div className=''>
        <Header title="Checkout" setbaricon={false} setcarticon={false} />
        <CheckoutPage/>
    </div>
  )
}

export default CheckoutScreen