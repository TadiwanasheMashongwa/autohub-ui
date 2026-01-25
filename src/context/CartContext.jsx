import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../features/auth/AuthContext';
import { toast } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  // Load cart when user logs in
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const refreshCart = async () => {
    try {
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to load cart");
    }
  };

  const addItem = async (partId, quantity = 1) => {
    try {
      await cartApi.addToCart(partId, quantity);
      toast.show("Part Reserved in Cart", "success");
      await refreshCart();
      setIsDrawerOpen(true);
    } catch (err) {
      // Error handled by apiClient bridge (e.g., INSUFFICIENT_STOCK)
    }
  };

  const removeItem = async (itemId) => {
    try {
      await cartApi.removeFromCart(itemId);
      await refreshCart();
    } catch (err) {
      toast.show("Failed to remove item", "error");
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      removeItem, 
      refreshCart, 
      isDrawerOpen, 
      setIsDrawerOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);