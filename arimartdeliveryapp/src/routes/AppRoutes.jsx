import { Routes, Route } from 'react-router-dom';

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
import Support from '../components/Account/Support';
import TermsAndConditions from '../components/Account/TermsAndConditions';
import AllottedArea from '../components/Account/AllottedArea';
import FAQ from '../components/Account/FAQ';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing & Onboarding */}
      <Route path="/" element={<ArimartDeliveryLanding />} />
      <Route path="/delivery" element={<Onboard />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/info" element={<PersonalInfomation />} />
      <Route path="/info/docs" element={<Infodoc />} />
      <Route path="/info/docs/upload" element={<DocumentSelector />} />
      <Route path="/info/docs/upload/:type" element={<UploadDocument />} />
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
      <Route path="/allotedarea" element={<AllottedArea />} />
      <Route path="/faq" element={<FAQ />} />

      {/* 🚚 Delivery Workflow */}
      <Route path="/order/pickup" element={<PickupPage />} />
      <Route path="/order/navigate" element={<DeliveryNavigation />} />
      <Route path="/order/scan" element={<DeliveryScanPage />} />
    </Routes>
  );
}
