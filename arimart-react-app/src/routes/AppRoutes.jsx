import { Routes, Route, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../Store/authSlice';
import { Toaster, toast } from 'react-hot-toast';
import { useDeviceType } from '../hooks/useDeviceType';
import ScrollToTop from '../utils/ScrollToTop';
import ResponsiveLayout from '../layouts/ResponsiveLayout';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

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
import JointoGroup from '../pages/GroupBuy/JointoGroup';
import SubcategoryExplore from '../pages/Explore/SubcategoryExplore';
import TopPriceProducts from '../pages/TopStores/TopPriceProducts';
import ArimartPayscreen from '../pages/PaymentScreen/ArimartPayscreen';
import SplashScreen from '../components/Onboarding/SplashScreen';
import AffiliateProgram from '../components/AffiliateProgram/AffiliateProgram';
import HotDeals from '../components/Home/HotDeals';

const publicRoutes = [
  "/", "/home", "/onboard", "/auth", "/about", "/contactus", "/faq", "/privacypolicy",
  "/search", "/categories", "/topstore/:price", "/explore", "/foryou", "group-buying", "group/join/:groupid/:grouprefercode"
];

export default function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  
  // Splash Screen State - Only for Capacitor (Native)
  const [showSplash, setShowSplash] = useState(Capacitor.isNativePlatform());
  const [isAppReady, setIsAppReady] = useState(false);

  const isNativeApp = Capacitor.isNativePlatform();
  const isProductPage = location.pathname.startsWith("/category");

  const isPublic = isProductPage || publicRoutes.some(route =>
    matchPath({ path: route, end: true }, location.pathname)
  );

  // Handle splash screen timing
  useEffect(() => {
    if (isNativeApp && showSplash) {
      const splashTimer = setTimeout(() => {
        setShowSplash(false);
        setIsAppReady(true);
      }, 3000);

      return () => clearTimeout(splashTimer);
    } else if (!isNativeApp) {
      setIsAppReady(true);
    }
  }, [isNativeApp, showSplash]);

  // Main app logic - only runs after splash is done
  useEffect(() => {
    if (!isAppReady) return;

    dispatch(checkAuth());

    const handleRouting = async () => {
      const onboarded = await Preferences.get({ key: 'hasOnboarded' });

      // if (location.pathname === '/onboard' && !Capacitor.isNativePlatform()) {
      //   navigate("/", { replace: true });
      //   return;
      // }

      if (location.pathname === '/' && onboarded.value !== 'true' && Capacitor.isNativePlatform()) {
        navigate("/onboard", { replace: true });
        return;
      }

      if (!isPublic && !isAuthenticated) {
        toast.error("Login Please");
        navigate("/auth", { replace: true });
        return;
      }

      // if (isAuthenticated && ['/', '/auth', '/onboard'].includes(location.pathname)) {
      //   navigate("/home", { replace: true });
      // }
    };

    handleRouting();
  }, [location.pathname, isAuthenticated, isAppReady]);

  // Page loading animation - only animate content, not layout
  useEffect(() => {
    if (!isAppReady) return;
    
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300); // Reduced time
    return () => clearTimeout(timer);
  }, [location.key, isAppReady]);

  // Show splash screen only on native platforms
  if (isNativeApp && showSplash) {
    return <SplashScreen />;
  }

  // Don't render anything until app is ready
  if (!isAppReady) {
    return null;
  }

  return (
    <ResponsiveLayout>
      <ScrollToTop />
      
      {/* Progress bar - only for page content loading */}
      {isLoading && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 h-1 bg-green-500 z-50"
        />
      )}

      {/* Only animate the page content, not the entire layout */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="min-h-screen"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            {/* {Capacitor.isNativePlatform() && <Route path="/onboard" element={<Onboarding />} />} */}
            <Route path="/onboard" element={<Onboarding />} />
            <Route path="/auth" element={<AuthFlow />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/contactus" element={<Contactusscreen />} />
            <Route path="/faq" element={<Faqscreen />} />
            <Route path="/privacypolicy" element={<PrivacyPolicyScreen />} />
            <Route path="/topstore/:price" element={<TopPriceProducts />} />
            <Route path="/notification" element={<NotificationScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/foryou" element={<Foryoupagescreeen />} />
            <Route path="/home/referandearn" element={<Refferearn />} />
            <Route path="/home/wallet" element={<Walletpage />} />
            <Route path="/account" element={<AccountIndex />} />
            <Route path="/account/editprofile" element={<EditProfilescreen />} />
            <Route path="/explore" element={<ExploreIndex />} />
            <Route path="/arimartpay" element={<ArimartPayscreen />} />
            <Route path="/subcategory/:subcategoryId" element={<SubcategoryExplore />} />
            <Route path="/cart" element={<Cartpage />} />
            <Route path="/wishlist" element={<WishlistScreen />} />
            <Route path="/promocodes" element={<PromocodeScreen />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/orders" element={<OrderScreen />} />
            <Route path="/orders/tracking/:trackId" element={<OrderTrack />} />
            <Route path="/orders/track/:trackId" element={<Trackorders />} />
            <Route path="/checkout/payment" element={<PaymentOrder />} />
            <Route path="/affiliate" element={<AffiliateProgram />} />
            <Route path="/category/deals" element={<HotDeals />} />
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
            <Route path="group/join/:groupid/:grouprefercode" element={<JointoGroup />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </ResponsiveLayout>
  );
}