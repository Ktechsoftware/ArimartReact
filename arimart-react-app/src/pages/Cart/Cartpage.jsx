import React from 'react'
import EmptyCart from '../../components/Cart/EmptyCart'
import Header from '../../components/Header'

function Cartpage() {
  return (
    <div>
        <Header title={"Your Cart"} />
        <EmptyCart/>
    </div>
  )
}

export default Cartpage