import { createContext, useContext, useState, useEffect } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from '../features/auth/AuthContext';
import { toast } from './NotificationContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
      console.error("Failed to load cart from Railway");
    }
  };

  const addItem = async (partId, quantity = 1) => {
    setLoading(true);
    try {
      const updatedCart = await cartApi.addToCart(partId, quantity);
      setCart(updatedCart); 
      toast.show("Part Reserved in Cart", "success");
      setIsDrawerOpen(true);
    } catch (err) {
      // CHECKLIST Step 3: Error Handling for Insufficient Stock
      const message = err.response?.data?.message || "Failed to add to cart";
      toast.show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  // CHECKLIST Step 1 & 3: Quantity Logic & Error Handling
  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeItem(cartItemId);
    }

    setLoading(true);
    try {
      const updatedCart = await cartApi.updateQuantity(cartItemId, newQuantity);
      setCart(updatedCart);
    } catch (err) {
      const message = err.response?.data?.message || "Stock limit reached";
      toast.show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const updatedCart = await cartApi.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (err) {
      toast.show("Failed to remove item", "error");
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart(null);
      toast.show("Cart cleared", "success");
    } catch (err) {
      toast.show("Failed to clear cart", "error");
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addItem, 
      removeItem, 
      updateQuantity, // Added for Step 3 UI
      clearCart,
      refreshCart, 
      isDrawerOpen, 
      setIsDrawerOpen,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);