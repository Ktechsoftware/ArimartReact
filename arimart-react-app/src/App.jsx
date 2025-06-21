import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext'; // Adjust path as needed
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

export default function App() {
  return (
    <>
    <ThemeProvider>
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
   <Toaster
        // 'top-center' is still required to align horizontally
        position="top-center"
        containerStyle={{
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        toastOptions={{
          style: {
            background: '#fff',
            color: '#333',
            borderRadius: '12px',
            padding: '12px 16px',
          },
          className: 'shadow-xl text-sm dark:bg-gray-800 dark:text-white',
        }}
      />
      </>
  );
}