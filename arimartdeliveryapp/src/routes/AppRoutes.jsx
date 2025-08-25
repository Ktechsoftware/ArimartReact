import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Existing pages
import Onboard from '../pages/Onboard';
import Otp from '../pages/Otp';
import { PersonalInfomation } from '../pages/PersonalInfomation';
import Infodoc from '../pages/Infodoc';
import { DocumentSelector } from '../components/informationforms/DocumentSelector';
import { UploadDocument } from '../components/informationforms/UploadDocument';
import RegistrationStatus from '../components/informationforms/RegistrationStatus';
import ArimartDeliveryLanding from '../components/landing/ArimartDeliveryLanding';
import { AccountPage } from '../components/Home/AccountPage';
import { ReferAndEarn } from '../components/Home/ReferAndEarn';
import { LeaveApplicationPage } from '../components/Applicationpage/LeaveApplicationPage';
import { WalletPage } from '../components/wallet/WalletPage';
import NotificationsPage from '../components/notifications/NotificationsPage';
import { PickupPage } from '../components/delivery/PickupPage';
import DeliveryNavigation from '../components/delivery/DeliveryNavigation';
import { DeliveryScanPage } from '../components/delivery/DeliveryScanPage';
import { ArimartHome } from '../components/Home/Home';
import { OrdersPage } from '../components/Home/OrdersPage';
import EditProfile from '../components/Account/EditProfile';
import {Support} from '../components/Account/Support';
import TermsAndConditions from '../components/Account/TermsAndConditions';
import {AllottedArea} from '../components/Account/AllottedArea';
import SplashScreen from '../components/onboard/SplashScreen'
import FAQ from '../components/Account/FAQ';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import DeliveryScanner from '../components/delivery/DeliveryOrderScanner';
import { VehicleDetails } from '../components/informationforms/VehicleDetails';
import { BankAccountDetails } from '../components/informationforms/BankAccountDetails';
import { EmergencyDetails } from '../components/informationforms/EmergencyDetails';
import { Privacy } from '../components/Account/Privacy';
import { SettingsPage } from '../components/Account/SettingsPage';
import { OTPDeliveryScreen } from '../components/delivery/OTPDeliveryScreen';
import { DeliverySearchPage } from '../components/delivery/DeliverySearchPage';
import { useAuth } from '../hooks/useAuth';

export default function AppRoutes() {
  const [showSplash, setShowSplash] = useState(Capacitor.isNativePlatform());
  const [isAppReady, setIsAppReady] = useState(false);
  const isNativeApp = Capacitor.isNativePlatform();
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, userId } = useAuth();
  const location = useLocation();

  // Handle splash screen
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

  // Page loading animation
  useEffect(() => {
    if (!isAppReady) return;
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.key, isAppReady]);

  // Show splash screen
  if (isNativeApp && showSplash) return <SplashScreen />;
  if (!isAppReady) return null;

  // 🚨 Auth & Native Redirect Logic
  if (isAuthenticated || userId) {
    // Already logged in → redirect away from onboarding routes
    if (
      location.pathname === "/" ||
      location.pathname.startsWith("/delivery") ||
      location.pathname.startsWith("/otp") ||
      location.pathname.startsWith("/info")
    ) {
      return <Navigate to="/home" replace />;
    }
  } else {
    // Not logged in on Native App → skip landing page
    if (isNativeApp && location.pathname === "/") {
      return <Navigate to="/delivery" replace />;
    }
  }

  return (
    <Routes>
      {/* Landing & Onboarding */}
      {!isNativeApp && <Route path="/" element={<ArimartDeliveryLanding />} />}
      <Route path="/delivery" element={<Onboard />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/info" element={<PersonalInfomation />} />
      <Route path="/info/docs" element={<Infodoc />} />
      <Route path="/info/docs/upload" element={<DocumentSelector />} />
      <Route path="/info/docs/vehicle" element={<VehicleDetails />} />
      <Route path="/info/docs/bank" element={<BankAccountDetails />} />
      <Route path="/info/docs/emergency" element={<EmergencyDetails />} />
      <Route path="/info/docs/upload/:documentType" element={<UploadDocument />} />
      <Route path="/info/docs/register" element={<RegistrationStatus />} />

      {/* Orders & Account */}
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/home" element={<ArimartHome />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/refer&earn" element={<ReferAndEarn />} />
      <Route path="/leaveapplication" element={<LeaveApplicationPage />} />
      <Route path="/wallet" element={<WalletPage />} />
      <Route path="/notification" element={<NotificationsPage />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/support" element={<Support />} />
      <Route path="/termandcondition" element={<TermsAndConditions />} />
      <Route path="/privacypolicy" element={<Privacy />} />
      <Route path="/allotedarea" element={<AllottedArea />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/search" element={<DeliverySearchPage />} />

      {/* 🚚 Delivery Workflow */}
      <Route path="/order/pickup" element={<PickupPage />} />
      <Route path="/order/navigate" element={<DeliveryNavigation />} />
      <Route path="/order/scan" element={<DeliveryScanPage />} />
      <Route path="/order/deliveryorderscan" element={<DeliveryScanner />} />
      <Route path="/order/deliveryotp" element={<OTPDeliveryScreen />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/delivery"} replace />} />
    </Routes>
  );
}
