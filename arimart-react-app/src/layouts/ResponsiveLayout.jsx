import { useDeviceType } from '../hooks/useDeviceType';
import MobileLayout from './MobileLayout';
import WebLayout from './WebLayout';

export default function ResponsiveLayout({ children }) {
  const device = useDeviceType();

  return device === 'mobile' ? (
    <MobileLayout>{children}</MobileLayout>
  ) : (
    <WebLayout>{children}</WebLayout>
  );
}
