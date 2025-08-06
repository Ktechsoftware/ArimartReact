import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppContent from './routes/AppContent';
import { DealAlertModal } from './components/GroupBuying/DealAlertModal';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast'; // ✅ import Toaster

export default function App() {
  return (
    <CartProvider>
      <ThemeProvider>
        <Router>
          <DealAlertModal />
          <AppContent />
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
