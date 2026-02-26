import { Ingredient } from './recipe';

export interface CartItem {
  id: string;
  ingredient: Ingredient;
  quantity: number;
  recipeId?: string;
  recipeName?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface CartSummary {
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
}
