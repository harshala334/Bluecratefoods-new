import { create } from 'zustand';
import { storage } from '../utils/storage';

interface Restaurant {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    isAuthenticated: boolean;
    restaurant: Restaurant | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    restaurant: null,
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            // SIMULATION: Mock Login
            // In a real app, this would call API_CONFIG.ENDPOINTS.LOGIN
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

            // Validation (Mock)
            if (email.includes('burger')) {
                const user = {
                    id: 'REST-001',
                    name: 'Burger King',
                    email: email
                };
                set({
                    isAuthenticated: true,
                    restaurant: user,
                    isLoading: false
                });
                return;
            }

            if (email.includes('pizza')) {
                const user = {
                    id: 'REST-002',
                    name: 'Pizza Hut',
                    email: email
                };
                set({
                    isAuthenticated: true,
                    restaurant: user,
                    isLoading: false
                });
                return;
            }

            // Default User
            const user = {
                id: 'store-123',
                name: 'BlueCrate Partner',
                email: email
            };

            set({
                isAuthenticated: true,
                restaurant: user,
                isLoading: false,
            });

        } catch (e) {
            set({ isLoading: false, error: 'Login failed' });
        }
    },

    logout: async () => {
        set({ isAuthenticated: false, restaurant: null });
    },
}));
