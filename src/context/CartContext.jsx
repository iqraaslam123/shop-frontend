import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import { showSuccessToast, showErrorToast, showInfoToast } from '../utils/toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (err) {
      console.error(err);
      showErrorToast('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, name, image, price, qty = 1) => {
    if (!user) {
      showInfoToast('Please login to add items to cart');
      return;
    }
    try {
      const { data } = await API.post('/cart', { productId, name, image, price, qty });
      setCart(data);
      showSuccessToast(`${name} added to cart!`);
    } catch (err) {
      showErrorToast('Failed to add to cart');
    }
  };

  const updateQty = async (productId, qty) => {
    try {
      const { data } = await API.put(`/cart/${productId}`, { qty });
      setCart(data);
    } catch (err) {
      showErrorToast('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data);
      showSuccessToast('Item removed from cart');
    } catch (err) {
      showErrorToast('Failed to remove item');
    }
  };

  const cartCount = cart.items?.reduce((acc, item) => acc + item.qty, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, cartCount, addToCart, updateQty, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
