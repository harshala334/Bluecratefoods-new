import { create } from 'zustand';
import { Recipe } from '../types/recipe';
import { recipeService } from '../services/recipeService';

/**
 * Recipe Store - Manages recipe data and state
 */

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  timeCategory: string | null;
  difficulty: string | null;
  searchQuery: string | null;
  
  // Actions
  fetchRecipes: (params?: any) => Promise<void>;
  fetchRecipeById: (id: string) => Promise<void>;
  searchRecipes: (query: string) => Promise<void>;
  setTimeCategory: (category: string | null) => void;
  setDifficulty: (difficulty: string | null) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,
  timeCategory: null,
  difficulty: null,
  searchQuery: null,

  fetchRecipes: async (params?) => {
    try {
      set({ isLoading: true, error: null });
      
      const { timeCategory, difficulty, searchQuery } = get();
      
      const response = await recipeService.getRecipes({
        ...params,
        timeCategory: timeCategory || undefined,
        difficulty: difficulty || undefined,
        search: searchQuery || undefined,
      });
      
      set({ recipes: response.recipes, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch recipes',
        isLoading: false,
      });
    }
  },

  fetchRecipeById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const recipe = await recipeService.getRecipeById(id);
      
      set({ currentRecipe: recipe, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch recipe',
        isLoading: false,
      });
    }
  },

  searchRecipes: async (query) => {
    try {
      set({ isLoading: true, error: null, searchQuery: query });
      
      const recipes = await recipeService.searchRecipes(query);
      
      set({ recipes, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Search failed',
        isLoading: false,
      });
    }
  },

  setTimeCategory: (category) => {
    set({ timeCategory: category });
    get().fetchRecipes();
  },

  setDifficulty: (difficulty) => {
    set({ difficulty });
    get().fetchRecipes();
  },

  clearFilters: () => {
    set({ timeCategory: null, difficulty: null, searchQuery: null });
    get().fetchRecipes();
  },

  clearError: () => set({ error: null }),
}));

export default useRecipeStore;
