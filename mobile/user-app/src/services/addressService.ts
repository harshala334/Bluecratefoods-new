import { api } from './api';
import { API_CONFIG } from '../constants/config';
import { Address } from '../types/user';

export const addressService = {
  getAddresses: async (userId: string): Promise<Address[]> => {
    return api.get<Address[]>(`${API_CONFIG.BASE_URL}/users/${userId}/addresses`);
  },

  addAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<Address> => {
    return api.post<Address>(`${API_CONFIG.BASE_URL}/users/${userId}/addresses`, address);
  },

  deleteAddress: async (userId: string, addressId: string): Promise<void> => {
    return api.delete(`${API_CONFIG.BASE_URL}/users/${userId}/addresses/${addressId}`);
  },
};

export default addressService;
