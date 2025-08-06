// AppContent.jsx
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PushNotifications } from '@capacitor/push-notifications';
import { App as CapacitorApp } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import toast from 'react-hot-toast';
import AppRoutes from './AppRoutes';
import { checkAuth, sendFcmTokenToBackend } from '../Store/authSlice';
import { fetchNotifications, fetchUnreadCount } from '../Store/notificationSlice';
import { startSignalRConnection } from '../services/signalr'; 

export default function AppContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const userId = isAuthenticated ? userData?.id : null;
  
  // ✅ Move useRef outside of useEffect
  const lastBackPressTime = useRef(0);

  // Back Button Logic
  useEffect(() => {
    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      const currentTime = new Date().getTime();
      
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        if (location.pathname === '/home') {
          if (currentTime - lastBackPressTime.current < 2000) {
            CapacitorApp.exitApp();
          } else {
            lastBackPressTime.current = currentTime;
            toast.success('Press back again to exit');
          }
        } else {
          navigate(-1);
        }
      }
    });

    return () => {
      backButtonListener.remove();
    };
  }, [navigate, location.pathname]);

  // Auth check
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (userId && window.cordova) {
      dispatch(sendFcmTokenToBackend(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (userId) {
      startSignalRConnection(userId);
      dispatch(fetchNotifications({ page: 1, pageSize: 10 }));
      dispatch(fetchUnreadCount());
    }
  }, [userId, dispatch]);

  useEffect(() => {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', token => {
      console.log('🔑 Capacitor Token:', token.value);
    });

    PushNotifications.addListener('pushNotificationReceived', async notification => {
      console.log('📲 Foreground Notification:', notification);
      await Toast.show({
        text: `${notification.title}: ${notification.body}`,
        duration: 'long',
        position: 'top',
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', async notification => {
      console.log('✅ Notification tapped:', notification);
      await Toast.show({
        text: `Opened: ${notification.notification.title}`,
        duration: 'short',
        position: 'bottom',
      });
      // Optional redirect
      // navigate('/my-orders');
    });
  }, []);

  return <AppRoutes />;
}