import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-e7zjf3b6pq-uc.a.run.app/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getOrders: () => api.get('/users/orders'),
}

// Restaurant API
export const restaurantAPI = {
  getAll: (params?: any) => api.get('/restaurants', { params }),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  getMenu: (id: string) => api.get(`/restaurants/${id}/menu`),
  search: (query: string) => api.get('/restaurants/search', { params: { q: query } }),
}

// Order API
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getById: (id: string) => api.get(`/orders/${id}`),
  track: (id: string) => api.get(`/orders/${id}/track`),
  cancel: (id: string) => api.post(`/orders/${id}/cancel`),
}

// Payment API
export const paymentAPI = {
  createIntent: (orderId: string) => api.post('/payments/intent', { orderId }),
  confirm: (paymentId: string) => api.post(`/payments/${paymentId}/confirm`),
}

export default api
