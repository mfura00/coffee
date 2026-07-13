import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev[item.id];
      if (existing) {
        return { ...prev, [item.id]: { ...existing, qty: existing.qty + 1 } };
      }
      return {
        ...prev,
        [item.id]: {
          ...item,
          qty: 1,
          selectedSize: item.sizes?.[0]?.name || null,
        },
      };
    });
  }, []);

  const updateQty = useCallback((id, delta) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: { ...item, qty: newQty } };
    });
  }, []);

  const setSize = useCallback((id, sizeName) => {
    setCart(prev => {
      const item = prev[id];
      if (!item) return prev;
      return { ...prev, [id]: { ...item, selectedSize: sizeName } };
    });
  }, []);

  const getItemPrice = useCallback((item) => {
    if (item.selectedSize && item.sizes?.length) {
      const size = item.sizes.find(s => s.name === item.selectedSize);
      return size ? size.price : item.price;
    }
    return item.price;
  }, []);

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.qty, 0);

  const clearCart = useCallback(() => setCart({}), []);

  return (
    <CartContext.Provider value={{
      cart, cartItems, cartCount, cartTotal, cartOpen, setCartOpen,
      addToCart, updateQty, setSize, getItemPrice, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};
