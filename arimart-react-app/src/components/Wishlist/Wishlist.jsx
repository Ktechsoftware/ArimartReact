import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../../Store/wishlistSlice';
import EmptyWishlist from './EmptyWishlist';
import DProductCard from '../Products/DProductcards';
import ProductCardFullWidth from '../Products/ProductCardResponsive';
import ProductCardResponsive from '../Products/ProductCardResponsive';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth); // logged-in user
  const { items, loading, error } = useSelector((state) => state.wishlist);
  console.log("Wishlist: ", items);
  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchWishlist(userData.id));
    }
  }, [dispatch, userData?.id]);

  if (loading) return <p className="text-center py-10">Loading wishlist...</p>;
  // if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">My Wishlist</h1>

      {items.length === 0 ? (
        <EmptyWishlist />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {items.map((product) => (
            <ProductCardResponsive key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
