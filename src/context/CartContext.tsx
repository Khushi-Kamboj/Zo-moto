import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, MenuItem } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, restaurantName: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem, restaurantName: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        toast.success(`Added another ${menuItem.name} to cart`);
        return prev.map(item =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success(`${menuItem.name} added to cart`);
      return [...prev, { menuItem, quantity: 1, restaurantName }];
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => {
      const item = prev.find(i => i.menuItem.id === itemId);
      if (item) {
        toast.info(`${item.menuItem.name} removed from cart`);
      }
      return prev.filter(item => item.menuItem.id !== itemId);
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.menuItem.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    toast.info('Cart cleared');
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + item.menuItem.price * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
