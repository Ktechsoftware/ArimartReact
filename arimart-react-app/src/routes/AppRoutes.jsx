import { Routes, Route, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../Store/authSlice';
import { Toaster, toast } from 'react-hot-toast';
import { useDeviceType } from '../hooks/useDeviceType';
import ScrollToTop from '../utils/ScrollToTop';
import ResponsiveLayout from '../layouts/ResponsiveLayout';

// Pages
import OnboardingScreen from '../components/OnboardingScreen';
import Onboarding from '../components/Onboarding/Onboarding';
import AuthFlow from '../components/Auth/AuthFlow';
import Home from '../pages/Home/Home';
import Refferearn from '../pages/Home/Refferearn';
import Walletpage from '../pages/Home/Walletpage';
import AboutScreen from '../pages/Aboutus/AboutScreen';
import Contactusscreen from '../pages/Aboutus/Contactusscreen';
import Faqscreen from '../pages/GroceryFAQ/Faqscreen';
import PrivacyPolicyScreen from '../pages/Privacypolicy/PrivacyPolicyScreen';
import AccountIndex from '../pages/Account/AccountIndex';
import EditProfilescreen from '../pages/Account/EditProfilescreen';
import ExploreIndex from '../pages/Explore/ExploreIndex';
import Cartpage from '../pages/Cart/cartpage';
import WishlistScreen from '../pages/Wishlist/wishlistScreen';
import PromocodeScreen from '../pages/Promocode/PromocodeScreen';
import CheckoutScreen from '../pages/Orders/CheckoutScreen';
import OrderScreen from '../pages/Orders/OrderScreen';
import OrderTrack from '../pages/Orders/OrderTrack';
import Productpage from '../pages/Product/Productpage';
import Categoryindex from '../pages/Category';
import CategoryProductscreen from '../pages/CategoryProducts/CategoryProductscreen';
import Searchitems from '../pages/Searchproduct/Searchitems';
import NotificationScreen from '../pages/Notification/NotificationScreen';
import Foryoupagescreeen from '../pages/Foryouscreen/Foryoupagescreeen';
import TopProductStore from '../pages/TopStores/TopProductStore';
import Marketplace from '../pages/Mainstore/Marketplace';
import GroupDealScreen from '../pages/GroupBuy/GroupDealScreen';
import Termcondition from '../pages/Privacypolicy/termcondition';
import Trackorders from '../pages/Orders/Trackorders';
import PaymentOrder from '../pages/PaymentScreen/PaymentOrder';

const publicRoutes = [
  "/", "/home", "/onboard", "/auth", "/about", "/contactus", "/faq", "/privacypolicy",
  "/search", "/categories", "/topstore/:price", "/explore"
];

const hideBottomNavRoutes = [
  '/', '/onboard', '/auth', '/faq', '/privacypolicy', '/cart', '/checkout',
  '/account/editprofile', '/home/wallet', '/home/referandearn',
  '/wishlist', '/about', '/contactus', '/notification', '/promocodes'
];

const hideBottomNavRoutesWithPrefix = ['/product', '/orders', '/topstore'];
export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const device = useDeviceType();
  const [isLoading, setIsLoading] = useState(false);

  const shouldHideBottomNav =
    hideBottomNavRoutes.includes(location.pathname) ||
    hideBottomNavRoutesWithPrefix.some(prefix => location.pathname.startsWith(prefix));

  // ✅ Unified auth & route protection
  useEffect(() => {
    dispatch(checkAuth());

    const isProductPage = location.pathname.startsWith("/category");

    const isPublic = isProductPage || publicRoutes.some(route =>
      matchPath({ path: route, end: true }, location.pathname)
    );


    if (!isPublic && !isAuthenticated) {
      toast.error("Login Please");
      navigate("/auth", { replace: true });
    }


    // Redirect authenticated users away from landing/onboarding
    if (isAuthenticated && ['/', '/auth', '/onboard'].includes(location.pathname)) {
      navigate('/home', { replace: true });
    }
  }, [location.pathname, isAuthenticated]);

  // ✅ Loading bar on route change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
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
          <ResponsiveLayout hideBottomNav={shouldHideBottomNav}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
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
              <Route path="/orders/tracking/:trackId" element={<OrderTrack />} />
              <Route path="/orders/track/:trackId" element={<Trackorders />} />
              <Route path="/checkout/payment" element={<PaymentOrder />} />
              <Route path="/category">
                <Route index element={<Categoryindex />} />
                <Route path=":market/:categoryid" element={<Marketplace />} />
                <Route path=":market/subcategory/:subcategoryid" element={<CategoryProductscreen />} />
                <Route path=":market/:subcategory/product/:id" element={<Productpage />} />
              </Route>

              <Route path="/search" element={<Searchitems />} />
              <Route path="/term&condition" element={<Termcondition />} />
              <Route path="/categories" element={<Categoryindex />} />
              <Route path="/group-buying" element={<GroupDealScreen />} />
            </Routes>
          </ResponsiveLayout>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
