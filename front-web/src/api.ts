import axios from "axios";
import { OrderPlayload } from "./Orders/types";

const API_URL = import.meta.env.VITE_API_URL ?? import.meta.env.REACT_APP_API_URL ?? (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined) ?? 'http://localhost:8080';
const mapboxToken = import.meta.env.VITE_ACCESS_TOKEN_MAP_BOX ?? import.meta.env.REACT_APP_ACCESS_TOKEN_MAP_BOX ?? (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_ACCESS_TOKEN_MAP_BOX : undefined);

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type Category = {
  id: number;
  name: string;
};

export type ProductPayload = {
  name: string;
  price: number;
  description: string;
  imageUri: string;
  category?: { id: number };
};

export function fetchCategories() {
  return api.get<Category[]>(`/categories`);
}

export function fetchproducts(categoryId?: number) {
  const params = categoryId ? { categoryId } : {};
  return api.get(`/products`, { params });
}

export function createProduct(payload: ProductPayload) {
  return api.post(`/products`, payload);
}

export function updateProduct(id: number, payload: ProductPayload) {
  return api.put(`/products/${id}`, payload);
}

export function deleteProduct(id: number) {
  return api.delete(`/products/${id}`);
}

export function createCategory(name: string) {
  return api.post(`/categories`, { name });
}

export function updateCategory(id: number, name: string) {
  return api.put(`/categories/${id}`, { name });
}

export function deleteCategory(id: number) {
  return api.delete(`/categories/${id}`);
}

export function fetchLocalMapBox(local: string) {
  return axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${local}.json?access_token=${mapboxToken}`);
}

export function saveOrder(payload: OrderPlayload) {
  return api.post(`/orders`, payload);
}

export function fetchMyOrders() {
  return api.get(`/orders/me`);
}

export function loginApi(credentials: { email: String; password: String }) {
  return api.post(`/auth/login`, credentials);
}

export function registerApi(userData: { name: string; email: string; password: String; phone: string; employee?: boolean }) {
  return api.post(`/auth/register`, userData);
}

export default api;