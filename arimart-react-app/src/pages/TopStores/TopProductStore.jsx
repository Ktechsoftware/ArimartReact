import React from 'react'
import Header from '../../components/Header'
import TopProducts from '../../components/Explore/TopProducts'
import { useParams } from 'react-router-dom';

const TopProductStore = () => {
  const { price } = useParams(); 
  return (
    <div className='mb-10'>
         <Header title={`Top ₹${price} Store`} setbaricon={false} setcarticon={false} />
        <TopProducts/>
    </div>
  )
}

export default TopProductStore