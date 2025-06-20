import React from 'react'
import EmptyCart from '../../components/Cart/EmptyCart'
import Header from '../../components/Header'
import CartDetails from '../../components/Cart/CartDetails'

function Cartpage() {
  return (
    <div>
     <Header title="Your Cart" setbaricon={false} setcarticon={false} />
        <CartDetails/>
        <EmptyCart/>
    </div>
  )
}

export default Cartpage