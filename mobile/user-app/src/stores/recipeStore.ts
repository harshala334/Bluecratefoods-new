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
  searchHistory: { query: string; count: number; lastUsed: number }[];
  itemHistory: { id: string; name: string; image: string; count: number; lastUsed: number; product: Recipe }[];

  // Actions
  fetchRecipes: (params?: any) => Promise<void>;
  fetchRecipeById: (id: string) => Promise<void>;
  searchRecipes: (query: string) => Promise<void>;
  addSearchTerm: (query: string) => void;
  addFrequentItem: (product: Recipe) => void;
  getUnifiedFrequentList: () => any[];
  clearSearchHistory: () => void;
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
  searchHistory: [],
  itemHistory: [],

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

  addSearchTerm: (query) => {
    if (!query || !query.trim()) return;
    const trimmed = query.trim();
    const { searchHistory } = get();

    const index = searchHistory.findIndex(s => s.query.toLowerCase() === trimmed.toLowerCase());
    const now = Date.now();

    let newHistory;
    if (index > -1) {
      newHistory = [...searchHistory];
      newHistory[index] = {
        ...newHistory[index],
        count: newHistory[index].count + 1,
        lastUsed: now
      };
    } else {
      newHistory = [{ query: trimmed, count: 1, lastUsed: now }, ...searchHistory];
    }

    set({ searchHistory: newHistory.slice(0, 50) });
  },

  addFrequentItem: (product) => {
    const { itemHistory } = get();
    const index = itemHistory.findIndex(i => String(i.id) === String(product.id));
    const now = Date.now();

    let newHistory;
    if (index > -1) {
      newHistory = [...itemHistory];
      newHistory[index] = {
        ...newHistory[index],
        count: newHistory[index].count + 1,
        lastUsed: now
      };
    } else {
      newHistory = [{
        id: String(product.id),
        name: product.name,
        image: product.image,
        count: 1,
        lastUsed: now,
        product
      }, ...itemHistory];
    }

    set({ itemHistory: newHistory.slice(0, 50) });
  },

  getUnifiedFrequentList: () => {
    const { searchHistory, itemHistory } = get();

    const mappedSearches = searchHistory.map(s => ({
      type: 'search' as const,
      id: s.query,
      title: s.query,
      score: s.count * 1000000 + s.lastUsed,
      lastUsed: s.lastUsed
    }));

    const mappedItems = itemHistory.map(i => ({
      type: 'product' as const,
      id: i.id,
      title: i.name,
      image: i.image,
      product: i.product,
      score: i.count * 1000000 + i.lastUsed,
      lastUsed: i.lastUsed
    }));

    const combined = [...mappedSearches, ...mappedItems];
    if (combined.length === 0) return [];

    return combined
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  },

  clearSearchHistory: () => set({ searchHistory: [], itemHistory: [] }),

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
