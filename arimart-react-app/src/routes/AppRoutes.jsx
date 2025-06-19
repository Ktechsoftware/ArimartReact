// AppRoutes.jsx
import { Routes, Route, useLocation } from 'react-router-dom';
import OnboardingScreen from '../components/OnboardingScreen';
import AuthFlow from '../components/Auth/AuthFlow';
import Home from '../pages/Home/Home';
import Categoryindex from '../pages/Category';
import BottomNav from '../components/BottomNav';
import AccountIndex from '../pages/Account/AccountIndex';
import ExploreIndex from '../pages/Explore/ExploreIndex';
import Cartpage from '../pages/Cart/cartpage';
import Productpage from '../pages/Product/Productpage';
import ReferAndEarn from '../components/Widgets/ReferAndEarn';
import Refferearn from '../pages/Home/Refferearn';
import Walletpage from '../pages/Home/Walletpage';

export default function AppRoutes() {
  const location = useLocation();
  const hideBottomNavRoutes = ['/', '/auth'];

const shouldHideBottomNav =
  hideBottomNavRoutes.includes(location.pathname) ||
  location.pathname.startsWith('/product');


  return (
    <div className="">
      <Routes>
        <Route path="/" element={<OnboardingScreen />} />
        <Route path="/auth" element={<AuthFlow />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/referandearn" element={<Refferearn />} />
        <Route path="/home/wallet" element={<Walletpage />} />
        <Route path="/account" element={<AccountIndex />} />
        <Route path="/explore" element={<ExploreIndex />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/product/:category/:id" element={<Productpage />} />
        <Route path="/categories" element={<Categoryindex />} />
      </Routes>
      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
}
