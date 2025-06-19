import React from 'react'
import Header from '../../components/Header'
import ProductDetails from '../../components/Products/ProductDetails'

function Productpage() {
  return (
    <div>
        <Header title={"Product Details"} />
        <ProductDetails/>
    </div>
  )
}

export default Productpage