import { api } from './api';
import { API_CONFIG } from '../constants/config';
import { Recipe } from '../types/recipe';

/**
 * Comprehensive Mock Data for Fallback/Demo
 * Ensuring all required fields from Recipe interface are present
 */
const MOCK_PRODUCTS: Recipe[] = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    description: 'Farm fresh red tomatoes',
    category: 'veg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad673?w=500&q=80',
    basePrice: 40,
    unit: '500g',
    rating: 4.8,
    reviews: 150,
    time: '10 min',
    difficulty: 'Easy',
    servings: 2,
    ingredients: [],
    steps: [],
    nutrition: { calories: 20, protein: 1, carbs: 4, fat: 0 },
    bulkTiers: [{ quantity: '5 kg', price: 180 }, { quantity: '10 kg', price: 340 }]
  },
  {
    id: 2,
    name: 'Frozen Veg Spring Rolls',
    description: 'Crispy and delicious',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7ea?w=500&q=80',
    basePrice: 120,
    unit: 'pack of 12',
    rating: 4.5,
    reviews: 85,
    time: '15 min',
    difficulty: 'Easy',
    servings: 4,
    ingredients: [],
    steps: [],
    nutrition: { calories: 150, protein: 3, carbs: 20, fat: 7 },
    bulkTiers: [{ quantity: '1 kg', price: 450 }, { quantity: '2 kg', price: 850 }]
  },
  {
    id: 3,
    name: 'Instant Noodles (5min)',
    description: 'Quick and tasty',
    category: '5min',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80',
    basePrice: 30,
    unit: '1 serving',
    rating: 4.2,
    reviews: 200,
    time: '5 min',
    difficulty: 'Easy',
    servings: 1,
    ingredients: [],
    steps: [],
    nutrition: { calories: 300, protein: 5, carbs: 40, fat: 12 },
    bulkTiers: [{ quantity: '10 pcs', price: 280 }, { quantity: '20 pcs', price: 540 }]
  },
  {
    id: 4,
    name: 'Premium Chicken Breast',
    description: 'Fresh and tender',
    category: 'meat',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&q=80',
    basePrice: 250,
    unit: '500g',
    rating: 4.9,
    reviews: 60,
    time: '20 min',
    difficulty: 'Medium',
    servings: 2,
    ingredients: [],
    steps: [],
    nutrition: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    bulkTiers: [{ quantity: '2 kg', price: 950 }, { quantity: '5 kg', price: 2300 }]
  },
  {
    id: 5,
    name: 'Basmati Rice (5kg)',
    description: 'Long grain aromatic rice',
    category: 'grocery',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    basePrice: 450,
    unit: '5kg',
    rating: 4.7,
    reviews: 120,
    time: '25 min',
    difficulty: 'Easy',
    servings: 20,
    ingredients: [],
    steps: [],
    nutrition: { calories: 350, protein: 7, carbs: 78, fat: 0.5 },
    bulkTiers: [{ quantity: '25 kg', price: 2100 }, { quantity: '50 kg', price: 4000 }]
  },
  {
    id: 6,
    name: 'Eco-friendly Paper Bags',
    description: 'Safe for environment',
    category: 'packaging',
    image: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=500&q=80',
    basePrice: 15,
    rating: 4.6,
    reviews: 45,
    time: 'N/A',
    difficulty: 'Easy',
    servings: 1,
    ingredients: [],
    steps: [],
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    bulkTiers: [{ quantity: '100 pcs', price: 1200 }, { quantity: '500 pcs', price: 5500 }]
  },
  {
    id: 7,
    name: 'Paneer Butter Masala (10min)',
    description: 'Ready to eat gourmet meal',
    category: '10min',
    image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80',
    basePrice: 180,
    rating: 4.8,
    reviews: 90,
    time: '10 min',
    difficulty: 'Easy',
    servings: 2,
    ingredients: [],
    steps: [],
    nutrition: { calories: 250, protein: 12, carbs: 8, fat: 18 },
    bulkTiers: [{ quantity: '5 pcs', price: 850 }, { quantity: '10 pcs', price: 1600 }]
  },
  {
    id: 8,
    name: 'Frozen French Fries',
    description: 'Classic salted fries',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1573082833025-247ad2334e34?w=500&q=80',
    basePrice: 90,
    rating: 4.3,
    reviews: 110,
    time: '10 min',
    difficulty: 'Easy',
    servings: 2,
    ingredients: [],
    steps: [],
    nutrition: { calories: 312, protein: 3, carbs: 41, fat: 15 },
    bulkTiers: [{ quantity: '1 kg', price: 340 }, { quantity: '2.5 kg', price: 800 }]
  },
  {
    id: 9,
    name: 'Fresh Spinach',
    description: 'Leafy green goodness',
    category: 'veg',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80',
    basePrice: 25,
    rating: 4.5,
    reviews: 75,
    time: '5 min',
    difficulty: 'Easy',
    servings: 2,
    ingredients: [],
    steps: [],
    nutrition: { calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
    bulkTiers: [{ quantity: '5 kg', price: 110 }, { quantity: '10 kg', price: 200 }]
  },
  {
    id: 11,
    name: 'Frozen Green Peas',
    description: 'Freshly frozen green peas',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1592119747782-d8c12c2ea2b7?w=500&q=80',
    basePrice: 95,
    rating: 4.6,
    reviews: 210,
    time: '5 min',
    difficulty: 'Easy',
    servings: 4,
    ingredients: [],
    steps: [],
    nutrition: { calories: 81, protein: 5, carbs: 14, fat: 0.4 },
    bulkTiers: [{ quantity: '1 kg', price: 360 }, { quantity: '2 kg', price: 700 }]
  },
  {
    id: 12,
    name: 'Potato Wedges',
    description: 'Crispy seasoned wedges',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80',
    basePrice: 150,
    rating: 4.4,
    reviews: 180,
    time: '15 min',
    difficulty: 'Easy',
    servings: 3,
    ingredients: [],
    steps: [],
    nutrition: { calories: 250, protein: 3, carbs: 32, fat: 12 },
    bulkTiers: [{ quantity: '1 kg', price: 550 }, { quantity: '2.5 kg', price: 1300 }]
  },
  {
    id: 13,
    name: 'Frozen Momos',
    description: 'Authentic steamed momos',
    category: 'frozen',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=300&q=80',
    basePrice: 199,
    rating: 4.7,
    reviews: 320,
    time: '10 min',
    difficulty: 'Easy',
    servings: 2,
    ingredients: [],
    steps: [],
    nutrition: { calories: 120, protein: 8, carbs: 20, fat: 2 },
    bulkTiers: [{ quantity: '500g', price: 380 }, { quantity: '1 kg', price: 740 }]
  }
];

/**
 * Recipe/Product Service
 */
export const recipeService = {
  // Get all recipes/products
  async getRecipes(params?: {
    timeCategory?: string;
    category?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
    authorId?: string;
  }): Promise<{ recipes: Recipe[]; total: number }> {
    try {
      const recipes = await api.get<Recipe[]>(API_CONFIG.ENDPOINTS.RECIPES, { params });
      return { recipes, total: recipes.length };
    } catch (error) {
      console.warn("RecipeService: Backend fetch failed, falling back to mock data.", error);
      return { recipes: MOCK_PRODUCTS, total: MOCK_PRODUCTS.length };
    }
  },

  // Get by ID
  async getRecipeById(id: string | number): Promise<Recipe> {
    try {
      return await api.get<Recipe>(API_CONFIG.ENDPOINTS.RECIPE_DETAIL(id.toString()));
    } catch (error) {
      // Ensure numerical ID check
      const numId = typeof id === 'string' ? parseInt(id, 10) : id;
      const found = MOCK_PRODUCTS.find(p => p.id === numId);
      if (found) return found;
      throw error;
    }
  },

  // Create
  async createRecipe(data: Partial<Recipe>): Promise<Recipe> {
    return api.post<Recipe>(API_CONFIG.ENDPOINTS.RECIPES, data);
  },

  // Search recipes/products with robust fallback
  async searchRecipes(query: string): Promise<Recipe[]> {
    try {
      return await api.get<Recipe[]>(API_CONFIG.ENDPOINTS.RECIPES, {
        params: { search: query },
      });
    } catch (error) {
      console.warn("RecipeService: Backend search failed, falling back to local mock data.", error);
      const lowerQuery = query.toLowerCase();
      // If no query, return a selection of mock products
      if (!lowerQuery) return MOCK_PRODUCTS.slice(0, 5);

      return MOCK_PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.description && product.description.toLowerCase().includes(lowerQuery))
      );
    }
  },

  // Get categories
  async getCategories(): Promise<any[]> {
    try {
      return await api.get<any[]>(API_CONFIG.ENDPOINTS.RECIPE_CATEGORIES);
    } catch (error) {
      return [
        { id: 'veg', name: 'Vegetables' },
        { id: 'frozen', name: 'Frozen' },
        { id: '5min', name: '5 Mins' },
        { id: '10min', name: '10 Mins' },
        { id: 'meat', name: 'Meat' },
        { id: 'grocery', name: 'Grocery' },
        { id: 'packaging', name: 'Packaging' },
      ];
    }
  },

  // Admin and other methods
  async getPendingRecipes(): Promise<Recipe[]> {
    return api.get<Recipe[]>(API_CONFIG.ENDPOINTS.PENDING_RECIPES);
  },

  async getAdminRecipes(): Promise<Recipe[]> {
    return api.get<Recipe[]>(API_CONFIG.ENDPOINTS.ADMIN_ALL_RECIPES);
  },

  async approveRecipe(id: string): Promise<Recipe> {
    return api.patch<Recipe>(API_CONFIG.ENDPOINTS.APPROVE_RECIPE(id), {});
  },

  async rejectRecipe(id: string): Promise<Recipe> {
    return api.patch<Recipe>(API_CONFIG.ENDPOINTS.REJECT_RECIPE(id), {});
  },

  async rejectByAuthor(authorId: string): Promise<any> {
    return api.patch(API_CONFIG.ENDPOINTS.REJECT_BY_AUTHOR(authorId), {});
  },

  async deleteRecipe(id: string): Promise<void> {
    return api.delete<void>(API_CONFIG.ENDPOINTS.RECIPE_DETAIL(id));
  },
};

export default recipeService;
