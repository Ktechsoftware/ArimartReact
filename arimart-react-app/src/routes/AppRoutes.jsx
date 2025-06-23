// AppRoutes.jsx
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import OnboardingScreen from '../components/OnboardingScreen';
import AuthFlow from '../components/Auth/AuthFlow';
import Home from '../pages/Home/Home';
import Categoryindex from '../pages/Category';
import BottomNav from '../components/BottomNav';
import AccountIndex from '../pages/Account/AccountIndex';
import ExploreIndex from '../pages/Explore/ExploreIndex';
import Cartpage from '../pages/Cart/cartpage';
import Productpage from '../pages/Product/Productpage';
import Refferearn from '../pages/Home/Refferearn';
import Walletpage from '../pages/Home/Walletpage';
import CheckoutScreen from '../pages/Orders/CheckoutScreen';
import OrderScreen from '../pages/Orders/OrderScreen';
import OrderTrack from '../pages/Orders/OrderTrack';
import WishlistScreen from '../pages/Wishlist/wishlistScreen';
import EditProfilescreen from '../pages/Account/EditProfilescreen';
import AboutScreen from '../pages/Aboutus/AboutScreen';
import Contactusscreen from '../pages/Aboutus/Contactusscreen';
import NotificationScreen from '../pages/Notification/NotificationScreen';
import Foryoupagescreeen from '../pages/Foryouscreen/Foryoupagescreeen';
import PromocodeScreen from '../pages/Promocode/PromocodeScreen';
import Onboarding from '../components/Onboarding/Onboarding';
import TopProductStore from '../pages/TopStores/TopProductStore';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../Store/authSlice';
import { Toaster, toast } from 'react-hot-toast';
import PrivacyPolicyScreen from '../pages/Privacypolicy/PrivacyPolicyScreen';
import Faqscreen from '../pages/GroceryFAQ/Faqscreen';
// import ResponsiveLayout from '../layouts/ResponsiveLayout';

export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

   const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());

    const publicRoutes = ['/', '/auth', '/onboard'];

    if (
      isAuthenticated &&
      publicRoutes.includes(location.pathname)
    ) {
      toast('You are already logged in!', {
        icon: '👋',
        duration: 2000,
        position: 'top-center',
      });
      navigate('/home', { replace: true });
    }
  }, [location.pathname, isAuthenticated]);

  const hideBottomNavRoutes = ['/','/onboard', '/auth', '/faq','/privacypolicy','/cart', '/checkout', '/account/editprofile', '/home/wallet', '/home/referandearn', '/wishlist', '/about', '/contactus', '/notification','/promocodes'];
  const hideBottomNavRoutesWithPrefix = ['/product', '/orders','/topstore'];

  const shouldHideBottomNav =
    hideBottomNavRoutes.includes(location.pathname) ||
    hideBottomNavRoutesWithPrefix.some(prefix => location.pathname.startsWith(prefix));

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800); // Adjust timing as needed
    return () => clearTimeout(timer);
  }, [location.key]);

  return (
    <div className="relative">
      {isLoading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          exit={{ width: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 h-1 bg-green-500 z-50"
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={location.key}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
        >
          {/* <ResponsiveLayout> */}
          <Routes>
            <Route path="/" element={<OnboardingScreen />} />
            <Route path="/onboard" element={<Onboarding />} />
            <Route path="/auth" element={<AuthFlow />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/contactus" element={<Contactusscreen />} />
            <Route path="/faq" element={<Faqscreen />} />
            <Route path="/privacypolicy" element={<PrivacyPolicyScreen />} />
            <Route path="/topstore/:price" element={<TopProductStore />} />
            <Route path="/notification" element={<NotificationScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/foryou" element={<Foryoupagescreeen />} />
            <Route path="/home/referandearn" element={<Refferearn />} />
            <Route path="/home/wallet" element={<Walletpage />} />
            <Route path="/account" element={<AccountIndex />} />
            <Route path="/account/editprofile" element={<EditProfilescreen />} />
            <Route path="/explore" element={<ExploreIndex />} />
            <Route path="/cart" element={<Cartpage />} />
            <Route path="/wishlist" element={<WishlistScreen />} />
            <Route path="/promocodes" element={<PromocodeScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/orders" element={<OrderScreen />} />
            <Route path="/orders/tracking" element={<OrderTrack />} />
            <Route path="/product/:category/:id" element={<Productpage />} />
            <Route path="/categories" element={<Categoryindex />} />
          </Routes>
        {/* </ResponsiveLayout> */}
        </motion.div>
      </AnimatePresence>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
}
