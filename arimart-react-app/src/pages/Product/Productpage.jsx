import React from 'react';
import ProductDetails from '../../components/Products/ProductDetails';
import Header from '../../components/Header/Header';
import ProductContentDetail from '../../components/Products/ProductContentDetail';

function Productpage() {
  return (
    <div className='md:mb-20'>
      {/* <Header title="Product Details" setbaricon={false} /> */}
      
      {/* Show only on mobile (below md) */}
      <div className="block md:hidden">
        <ProductDetails />
      </div>

      {/* Show only on md and larger screens */}
      <div className="hidden md:block">
        <ProductContentDetail />
      </div>
    </div>
  );
}

export default Productpage;
