import { Routes, Route } from 'react-router-dom';
import Onboard from '../pages/Onboard'
import Otp from '../pages/Otp'
import { PersonalInfomation } from '../pages/PersonalInfomation';
import Infodoc from '../pages/Infodoc';
import { DocumentSelector } from '../components/informationforms/DocumentSelector';
import { UploadDocument } from '../components/informationforms/UploadDocument';
import RegistrationStatus from '../components/informationforms/RegistrationStatus';
import Orderpage from '../pages/Home/Orderpage';
import Account from '../pages/Home/Account';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={< Onboard />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/info" element={<PersonalInfomation />} />
      <Route path="/info/docs" element={<Infodoc />} />
      <Route path="/info/docs/upload" element={<DocumentSelector />} />
      <Route path="/info/docs/upload/:type" element={<UploadDocument />} />
      <Route path="/info/docs/register" element={<RegistrationStatus />} />
      <Route path="/orders" element={<Orderpage />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
}
