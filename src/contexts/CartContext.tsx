/**
 * CartContext
 * Provides global cart state management with localStorage persistence
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { MenuItem, CartItem } from "@/types/menu";

/**
 * Cart Context type definition
 */
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

/**
 * Create the context with undefined default value
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Local storage key for cart persistence
 */
const CART_STORAGE_KEY = "foodhub-cart";

/**
 * CartProvider Props
 */
interface CartProviderProps {
  children: React.ReactNode;
}

/**
 * Load cart from localStorage
 */
const loadCartFromStorage = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Failed to load cart from storage:", error);
  }
  return [];
};

/**
 * Save cart to localStorage
 */
const saveCartToStorage = (cartItems: CartItem[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

/**
 * CartProvider Component
 * Wraps the application and provides cart state management
 */
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  /**
   * Add item to cart
   */
  const addToCart = useCallback((item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        toast.success(`Added another ${item.name} to cart`);
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`Added ${item.name} to cart`);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((id: string, delta: number) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      const newQuantity = item.quantity + delta;
      
      if (newQuantity <= 0) {
        toast.info("Item removed from cart");
        return prev.filter((i) => i.id !== id);
      }

      return prev.map((i) =>
        i.id === id ? { ...i, quantity: newQuantity } : i
      );
    });
  }, []);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    toast.info("Item removed from cart");
  }, []);

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Cart cleared");
  }, []);

  /**
   * Calculate cart total
   */
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /**
   * Calculate total item count
   */
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  /**
   * Cart drawer controls
   */
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const value: CartContextType = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartItemCount,
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use CartContext
 * @throws Error if used outside CartProvider
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
};