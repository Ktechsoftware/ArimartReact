import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../../Store/wishlistSlice';
import EmptyWishlist from './EmptyWishlist';
import ProductCardResponsive from '../Products/ProductCardResponsive';
import LoaderSpinner from '../LoaderSpinner'

const Wishlist = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (userData?.id) {
      dispatch(fetchWishlist(userData.id));
    }
  }, [dispatch, userData?.id]);

  // 🌀 Full Page Loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <LoaderSpinner />
      </div>
    );
  }

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
