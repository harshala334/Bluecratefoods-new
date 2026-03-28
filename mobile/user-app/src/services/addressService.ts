import { api } from './api';
import { API_CONFIG } from '../constants/config';

export interface Address {
  id: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary: boolean;
  latitude?: number;
  longitude?: number;
}

export const addressService = {
  getAddresses: async (userId: string): Promise<Address[]> => {
    return api.get<Address[]>(`${API_CONFIG.BASE_URL}/user/users/${userId}/addresses`);
  },

  addAddress: async (userId: string, address: Omit<Address, 'id'>): Promise<Address> => {
    return api.post<Address>(`${API_CONFIG.BASE_URL}/user/users/${userId}/addresses`, address);
  },

  deleteAddress: async (userId: string, addressId: string): Promise<void> => {
    return api.delete(`${API_CONFIG.BASE_URL}/user/users/${userId}/addresses/${addressId}`);
  },
};

export default addressService;
