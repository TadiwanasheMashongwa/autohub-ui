import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './features/auth/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import './index.css'; // Ensure this matches the file we created in Step 1
import App from './App.jsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>
);