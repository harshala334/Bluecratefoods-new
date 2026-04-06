import { QueryClient } from '@tanstack/react-query';

/**
 * Global Query Client for React Query
 * Configured with staleTime to reduce redundant fetching
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Rely on useSync to invalidate
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      retry: 2,
      refetchOnWindowFocus: false, // Disabling refocus fetch; handled by useSync
    },
  },
});

export default queryClient;
