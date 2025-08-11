import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { DealAlertModal } from './components/GroupBuying/DealAlertModal';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <CartProvider>
      <ThemeProvider>
        <Router>
          <DealAlertModal />
          <AppRoutes />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </CartProvider>
  );
}