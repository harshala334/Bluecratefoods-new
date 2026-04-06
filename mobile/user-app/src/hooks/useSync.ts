import { useEffect, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { API_CONFIG, STORAGE_KEYS } from '../constants/config';
import { storage } from '../utils/storage';

/**
 * useSync Hook
 * Checks for server-side changes when the app is opened or comes to foreground.
 * Updates local cache only if changes are detected.
 */
export const useSync = () => {
  const queryClient = useQueryClient();

  const checkSync = useCallback(async () => {
    try {
      console.log('[useSync] Checking for server-side updates...');
      
      // 1. Get last updated timestamp from server
      const response = await api.get<{ lastUpdated: string }>(API_CONFIG.ENDPOINTS.RECIPE_LAST_UPDATED);
      const serverLastUpdated = new Date(response.lastUpdated).getTime();

      // 2. Get last synced timestamp from local storage
      const localLastSynced = await storage.getItem<number>(STORAGE_KEYS.SYNC_LAST_UPDATED) || 0;

      // 3. If server is newer, invalidate queries to force refetch
      if (serverLastUpdated > localLastSynced) {
        console.log('[useSync] Changes detected! Invalidating product queries...');
        
        // Invalidate product-related queries
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        await queryClient.invalidateQueries({ queryKey: ['categories'] });
        
        // Update local sync timestamp
        await storage.setItem(STORAGE_KEYS.SYNC_LAST_UPDATED, serverLastUpdated);
      } else {
        console.log('[useSync] No changes detected. Using cached data.');
      }
    } catch (error) {
      console.error('[useSync] Sync check failed:', error);
    }
  }, [queryClient]);

  useEffect(() => {
    // Initial check on mount
    checkSync();

    // Check again when app comes to foreground
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkSync();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [checkSync]);

  return { checkSync };
};

export default useSync;
