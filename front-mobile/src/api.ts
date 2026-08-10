import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, Category, Order, OrderPayload, Product, User } from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8080';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('@dsdeliver:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    // Continua sem token se houver falha de leitura
  }
  return config;
});

// Auth
export function loginApi(credentials: { email: string; password: string }) {
  return api.post<AuthResponse>('/auth/login', credentials);
}

export function registerApi(userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
  employee?: boolean;
}) {
  return api.post<User>('/auth/register', userData);
}

// Categories & Products
export function fetchCategories() {
  return api.get<Category[]>('/categories');
}

export function fetchProducts(categoryId?: number) {
  const params = categoryId ? { categoryId } : {};
  return api.get<Product[]>('/products', { params });
}

// Orders
export function fetchOrders() {
  return api.get<Order[]>('/orders');
}

export function fetchMyOrders() {
  return api.get<Order[]>('/orders/me');
}

export function createOrder(payload: OrderPayload) {
  return api.post<Order>('/orders', payload);
}

export function confirmDelivery(orderId: number) {
  return api.put<Order>(`/orders/${orderId}/delivered`);
}

export default api;