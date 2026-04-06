import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { recipeService } from '../services/recipeService';
import { Recipe } from '../types/recipe';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/config';
import { HOME_CATEGORIES, CategoryConfig } from '../constants/homeConfig';
import { CategorySection } from '../constants/categories';

interface HomeCache {
  productMap: Record<string, Recipe[]>;
  bestsellers: Recipe[];
}

/**
 * useHomeProducts Hook
 * Fetches home screen data and persists it manually to AsyncStorage for instant loading on cold start.
 */
export const useHomeProducts = () => {
  const [initialData, setInitialData] = useState<HomeCache | undefined>(undefined);
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);

  // 1. Load from storage on mount
  useEffect(() => {
    const loadCache = async () => {
      try {
        const cached = await storage.getItem<HomeCache>(STORAGE_KEYS.SYNC_PRODUCTS_CACHE);
        if (cached && Object.keys(cached.productMap || {}).length > 0) {
          setInitialData(cached);
        }
      } catch (err) {
        console.warn('[useHomeProducts] Failed to load cache', err);
      } finally {
        setIsStorageLoaded(true);
      }
    };
    loadCache();
  }, []);

  // 2. React Query for fetching/management
  const query = useQuery({
    queryKey: ['products', 'home'],
    queryFn: async () => {
      const featuredCategories = HOME_CATEGORIES.filter((c: CategoryConfig) => c.row <= 3).map((c: CategoryConfig) => c.id);
      const productMap: Record<string, Recipe[]> = {};
      
      await Promise.all(featuredCategories.map(async (catId: string) => {
        const { recipes } = await recipeService.getRecipes({ category: catId, limit: 5 });
        if (recipes && recipes.length > 0) {
          productMap[catId] = recipes;
        }
      }));

      const { recipes: bestsellerProducts } = await recipeService.getRecipes({ limit: 10 });
      
      const newData = {
        productMap,
        bestsellers: bestsellerProducts
      };

      // Persist to storage upon successful fetch
      await storage.setItem(STORAGE_KEYS.SYNC_PRODUCTS_CACHE, newData);
      
      return newData;
    },
    // Only fetch if no initial data or if explicitly invalidated by useSync
    initialData: initialData,
    enabled: isStorageLoaded,
  });

  return {
    ...query,
    loadingLive: query.isLoading && !query.data, // Shows indicator only on absolute first load if no cache
    homeData: query.data,
  };
};

export default useHomeProducts;
