import React from 'react'
import Header from '../../components/Header/Header'
import { useParams } from 'react-router-dom';
import TopProductsComponent from '../../components/Explore/TopProductsComponent';

const TopPriceProducts = () => {
  const { price } = useParams(); 
  return (
    <div className='mb-10'>
         <Header title={`Top ₹${price} Store`} setbaricon={false} setcarticon={false} />
         <div className='max-w-6xl p-2 mx-auto mt-5'>
        <TopProductsComponent/>
        </div>
    </div>
  )
}

export default TopPriceProducts