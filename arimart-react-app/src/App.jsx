import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { DealAlertModal } from './components/GroupBuying/DealAlertModal';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './Store';
import { fetchCartByUserId } from './Store/cartSlice';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';

function AppContent() {
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((state) => state.auth);
  const userId = isAuthenticated ? userData?.id : null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchCartByUserId(userId));
    }
  }, [userId, dispatch]);

  return (
    <>
      <DealAlertModal />
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
      <Toaster
        position="top-center"
        containerStyle={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        toastOptions={{
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-text)',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          className: 'shadow-xl text-sm bg-white text-gray-800 dark:bg-gray-800 dark:text-white',
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <CartProvider>
      <AppContent />
      </CartProvider>
    </Provider>
  );
}
