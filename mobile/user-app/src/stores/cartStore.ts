import { create } from 'zustand';
import { Cart, CartItem, CartSummary } from '../types/cart';
import { Ingredient } from '../types/recipe';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/config';

/**
 * Cart Store - Manages shopping cart state
 */

interface CartState extends Cart {
  isLoading: boolean;

  // Actions
  addItem: (ingredient: Ingredient, quantity: number, recipeId?: string, recipeName?: string) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  getCartSummary: () => CartSummary;
}

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + (item.ingredient.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.99; // Free delivery over ₹50 (adjust threshold if needed)
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal,
    deliveryFee,
    tax,
    discount: 0,
    total,
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,

  addItem: async (ingredient, quantity, recipeId?, recipeName?) => {
    try {
      const { items } = get();

      // Check if item already exists
      const existingItemIndex = items.findIndex(
        (item) => item.ingredient.id === ingredient.id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity
        newItems = [...items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${ingredient.id}-${Date.now()}`,
          ingredient,
          quantity,
          recipeId,
          recipeName,
        };
        newItems = [...items, newItem];
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.ingredient.price * item.quantity,
        0
      );

      // Save to storage
      await storage.setItem(STORAGE_KEYS.CART_DATA, newItems);

      set({ items: newItems, totalItems, totalPrice });
    } catch (error) {
      console.error('Add to cart error:', error);
    }
  },

  removeItem: async (itemId) => {
    try {
      const { items } = get();
      const newItems = items.filter((item) => item.id !== itemId);

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.ingredient.price * item.quantity,
        0
      );

      await storage.setItem(STORAGE_KEYS.CART_DATA, newItems);

      set({ items: newItems, totalItems, totalPrice });
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  },

  updateQuantity: async (itemId, quantity) => {
    try {
      const { items } = get();
      const newItems = items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = newItems.reduce(
        (sum, item) => sum + item.ingredient.price * item.quantity,
        0
      );

      await storage.setItem(STORAGE_KEYS.CART_DATA, newItems);

      set({ items: newItems, totalItems, totalPrice });
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  },

  clearCart: async () => {
    try {
      await storage.removeItem(STORAGE_KEYS.CART_DATA);
      set({ items: [], totalItems: 0, totalPrice: 0 });
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  },

  loadCart: async () => {
    try {
      set({ isLoading: true });

      const items = await storage.getItem<CartItem[]>(STORAGE_KEYS.CART_DATA);

      if (items && items.length > 0) {
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce(
          (sum, item) => sum + item.ingredient.price * item.quantity,
          0
        );

        set({ items, totalItems, totalPrice, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Load cart error:', error);
      set({ isLoading: false });
    }
  },

  getCartSummary: () => {
    const { items } = get();
    return calculateTotals(items);
  },
}));

export default useCartStore;
