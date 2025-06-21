import React from 'react'
import Header from '../../components/Header'
import ProductDetails from '../../components/Products/ProductDetails'

function Productpage() {
  return (
    <div className='mb-20'>
        <Header title={"Product Details"} setbaricon={false} setcarticon={false} />
        <ProductDetails/>
    </div>
  )
}

export default Productpage