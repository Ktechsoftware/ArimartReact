import { useEffect, useState } from 'react';

export function useDeviceType() {
  const [device, setDevice] = useState(window.innerWidth <= 768 ? 'mobile' : 'desktop');

  useEffect(() => {
    const handleResize = () => {
      setDevice(window.innerWidth <= 768 ? 'mobile' : 'desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}
