import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { DealAlertModal } from './components/GroupBuying/DealAlertModal';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './Store';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { checkAuth } from './Store/authSlice';
import { startSignalRConnection } from './services/signalr';
import { fetchNotifications, fetchUnreadCount } from './Store/notificationSlice';
import { PushNotifications } from '@capacitor/push-notifications';


// 🔧 APP CONTENT COMPONENT
function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const userId = isAuthenticated ? userData?.id : null;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (userId && window.cordova) {
      dispatch(sendFcmTokenToBackend(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      startSignalRConnection(userId);
      dispatch(fetchNotifications({ page: 1, pageSize: 10 }));
      dispatch(fetchUnreadCount());
    }
  }, [userId]);

  useEffect(() => {
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });

    PushNotifications.addListener('registration', token => {
      console.log('🔑 Capacitor Token:', token.value);
    });
  }, []);
  return (
    <>
      <DealAlertModal />
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </>
  );
}

// 🧩 WRAP WITH PROVIDERS
export default function App() {
  return (
    <Provider store={store}>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </Provider>
  );
}
