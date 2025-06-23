import React, { useRef } from 'react';
import Header from '../../components/Header';
import ProductDetails from '../../components/Products/ProductDetails';

function Productpage() {
  const cartIconRef = useRef(); // Declare here

  return (
    <div className='mb-20'>
      <Header title={"Product Details"} setbaricon={false} cartIconRef={cartIconRef} />
      <ProductDetails cartIconRef={cartIconRef} />
    </div>
  );
}

export default Productpage;
