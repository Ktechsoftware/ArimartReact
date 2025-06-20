import React from 'react'
import Header from '../../components/Header'
import EmptyWishlist from '../../components/Wishlist/EmptyWishlist'

function WishlistScreen() {
  return (
    <div className='mb-20'>
         <Header title="Wishlist" setbaricon={false} setcarticon={false} />
         <EmptyWishlist/>
    </div>
  )
}

export default WishlistScreen