import React from 'react'
import Header from '../../components/Header/Header'
import Wishlist from '../../components/Wishlist/Wishlist'

function WishlistScreen() {
  return (
    <div className='mb-20'>
         <Header title="Wishlist" setbaricon={false} setcarticon={false} />
         <Wishlist/>
    </div>
  )
}

export default WishlistScreen