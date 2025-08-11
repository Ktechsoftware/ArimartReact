import React from 'react'
import Header from '../../components/Header/Header'
import TopProducts from '../../components/Explore/TopProducts'
import { useParams } from 'react-router-dom';

const TopProductStore = () => {
  const { price } = useParams(); 
  return (
    <div className='mb-10'>
         {/* <Header title={`Top ₹${price} Store`} setbaricon={false} setcarticon={false} /> */}
         <div className='max-w-6xl mx-auto mt-5'>
        <TopProducts/>
        </div>
    </div>
  )
}

export default TopProductStore