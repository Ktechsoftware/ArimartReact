import React from 'react'
import EmptyCart from '../../components/Cart/EmptyCart'
import Header from '../../components/Header/Header'
import CartDetails from '../../components/Cart/CartDetails'

function Cartpage() {
  return (
    <div>
       {/* <Header title={"Cart"} setbaricon={false}  setcarticon={false}/> */}
        <CartDetails/>
    </div>
  )
}

export default Cartpage