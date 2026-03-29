import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data: any) => API.post('/auth/login', data),
  register: (data: any) => API.post('/auth/register', data),
};

export const listingService = {
  getAll: (params?: any) => API.get('/listings', { params }),
  getById: (id: string) => API.get(`/listings/${id}`),
  create: (data: any) => API.post('/listings', data),
  update: (id: string, data: any) => API.put(`/listings/${id}`, data),
  delete: (id: string) => API.delete(`/listings/${id}`),
};

export const bookingService = {
  create: (data: any) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings'),
  getById: (id: string) => API.get(`/bookings/${id}`),
};

export const stayService = {
  getAll: (params?: any) => API.get('/stays', { params }),
};

export const favoriteService = {
  toggle: (data: { listingId: string; listingModel: 'Listing' | 'Stay' }) => API.post('/favorites', data),
  getMyFavorites: () => API.get('/favorites'),
  checkIsFavorite: (listingId: string) => API.get(`/favorites/${listingId}/check`),
};

export default API;
