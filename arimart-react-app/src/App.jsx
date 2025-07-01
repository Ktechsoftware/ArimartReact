import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Adjust path as needed
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import { DealAlertModal } from './components/GroupBuying/DealAlertModal';
import { CartProvider } from './context/CartContext';
import { Provider } from 'react-redux';
import store from './Store';

export default function App() {
  return (
    <>
    <DealAlertModal/>
    <Provider store={store}>
      <CartProvider>
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
      </CartProvider>
      </Provider>
    </>
  );
}