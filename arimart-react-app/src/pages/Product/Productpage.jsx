import React from 'react'
import ProductDetails from '../../components/Products/ProductDetails'
import Header from '../../components/Header/Header'
import ProductContentDetail from '../../components/Products/ProductContentDetail'

function Productpage() {
  return (
    <div className='mb-20'>
        <Header title={"Product Details"} setbaricon={false} />
        <ProductDetails/>
        <ProductContentDetail/>
    </div>
  )
}

export default Productpage