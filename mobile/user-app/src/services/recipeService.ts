import { api } from './api';
import { API_CONFIG } from '../constants/config';
import { Recipe } from '../types/recipe';

/**
 * Recipe Service
 */

export const recipeService = {
  // TODO: [CLOUDINARY] Implement uploadImage function
  // 1. Accepts file object (uri, type, name)
  // 2. Uploads to Cloudinary (either via signed preset or backend proxy)
  // 3. Returns the secure_url to be used in createRecipe
  // async uploadImage(imageFile: any): Promise<string> { ... },

  // Get all recipes
  async getRecipes(params?: {
    timeCategory?: string;
    difficulty?: string;
    search?: string;
    page?: number;
    limit?: number;
    authorId?: string;
  }): Promise<{ recipes: Recipe[]; total: number }> {
    // Current backend returns array, need to align response structure
    // If backend returns just array, wrapping it here for compatibility or updating return type
    const recipes = await api.get<Recipe[]>(API_CONFIG.ENDPOINTS.RECIPES, { params });
    // Filter locally if backend doesn't support all params yet, or assume backend does it
    // For now assuming backend returns array
    return { recipes, total: recipes.length };
  },

  // Get recipe by ID
  async getRecipeById(id: string | number): Promise<Recipe> {
    return api.get<Recipe>(API_CONFIG.ENDPOINTS.RECIPE_DETAIL(id.toString()));
  },

  // Create recipe
  async createRecipe(data: Partial<Recipe>): Promise<Recipe> {
    // TODO: [CLOUDINARY] Ensure 'data.image' is a Cloudinary URL before sending to backend
    return api.post<Recipe>(API_CONFIG.ENDPOINTS.RECIPES, data);
  },

  // Search recipes
  async searchRecipes(query: string): Promise<Recipe[]> {
    return api.get<Recipe[]>(API_CONFIG.ENDPOINTS.RECIPES, {
      params: { search: query },
    });
  },

  // Get recipe categories
  async getCategories(): Promise<any[]> {
    return api.get<any[]>(API_CONFIG.ENDPOINTS.RECIPE_CATEGORIES);
  },

  // Admin: Get pending recipes
  async getPendingRecipes(): Promise<Recipe[]> {
    return api.get<Recipe[]>(API_CONFIG.ENDPOINTS.PENDING_RECIPES);
  },

  // Admin: Get all recipes (for management)
  async getAdminRecipes(): Promise<Recipe[]> {
    return api.get<Recipe[]>(API_CONFIG.ENDPOINTS.ADMIN_ALL_RECIPES);
  },

  // Admin: Approve recipe
  async approveRecipe(id: string): Promise<Recipe> {
    return api.patch<Recipe>(API_CONFIG.ENDPOINTS.APPROVE_RECIPE(id), {});
  },

  // Admin: Reject recipe
  async rejectRecipe(id: string): Promise<Recipe> {
    return api.patch<Recipe>(API_CONFIG.ENDPOINTS.REJECT_RECIPE(id), {});
  },

  // Admin: Reject all recipes for a creator (on revocation)
  async rejectByAuthor(authorId: string): Promise<any> {
    return api.patch(API_CONFIG.ENDPOINTS.REJECT_BY_AUTHOR(authorId), {});
  },

  // Delete recipe
  async deleteRecipe(id: string): Promise<void> {
    return api.delete<void>(API_CONFIG.ENDPOINTS.RECIPE_DETAIL(id));
  },
};

export default recipeService;
