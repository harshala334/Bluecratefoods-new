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
  updateQuantityByIngredientId: (ingredientId: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
  getCartSummary: () => CartSummary;
}

// Helper to calculate price with volume discounts
export const calculateItemPrice = (item: CartItem) => {
  const quantity = item.quantity || 0;
  const basePrice = item.ingredient?.price || 0;
  
  if (!quantity) return 0;
  
  const bulkTiers = item.ingredient?.bulkTiers;
  
  if (!bulkTiers || !Array.isArray(bulkTiers) || bulkTiers.length === 0) {
    return basePrice * quantity;
  }
  
  // Parse and sort tiers by quantity descending
  const validTiers = bulkTiers
    .map(t => ({
      qty: parseInt(String(t?.quantity)) || 0,
      price: Number(t?.price) || 0
    }))
    .filter(t => t.qty > 0 && t.price > 0)
    .sort((a, b) => b.qty - a.qty);
    
  // Find the highest applicable tier
  const matchedTier = validTiers.find(t => quantity >= t.qty);
  
  if (matchedTier) {
    const unitPrice = matchedTier.price / matchedTier.qty;
    return quantity * unitPrice;
  }
  
  return basePrice * quantity;
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemPrice(item), 0);

  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  return {
    subtotal: isNaN(subtotal) ? 0 : subtotal,
    deliveryFee: isNaN(deliveryFee) ? 0 : deliveryFee,
    tax: isNaN(tax) ? 0 : tax,
    discount: 0,
    total: isNaN(total) ? 0 : total,
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

      const totalItems = newItems.length;
      const totalPrice = newItems.reduce(
        (sum, item) => sum + calculateItemPrice(item),
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

      const totalItems = newItems.length;
      const totalPrice = newItems.reduce(
        (sum, item) => sum + calculateItemPrice(item),
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

      const totalItems = newItems.length;
      const totalPrice = newItems.reduce(
        (sum, item) => sum + calculateItemPrice(item),
        0
      );

      await storage.setItem(STORAGE_KEYS.CART_DATA, newItems);

      set({ items: newItems, totalItems, totalPrice });
    } catch (error) {
      console.error('Update quantity error:', error);
    }
  },

  updateQuantityByIngredientId: async (ingredientId, quantity) => {
    try {
      const { items } = get();
      const existingItem = items.find(item => String(item.ingredient.id) === String(ingredientId));

      if (!existingItem) return;

      if (quantity <= 0) {
        await get().removeItem(existingItem.id);
        return;
      }

      const newItems = items.map((item) =>
        String(item.ingredient.id) === String(ingredientId) ? { ...item, quantity } : item
      );

      const totalItems = newItems.length;
      const totalPrice = newItems.reduce(
        (sum, item) => sum + calculateItemPrice(item),
        0
      );

      await storage.setItem(STORAGE_KEYS.CART_DATA, newItems);
      set({ items: newItems, totalItems, totalPrice });
    } catch (error) {
      console.error('Update quantity by ingredient ID error:', error);
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
        const totalItems = items.length;
        const totalPrice = items.reduce(
          (sum, item) => sum + calculateItemPrice(item),
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
