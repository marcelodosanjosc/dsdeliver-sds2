export type UserRole = 'ROLE_CLIENTE' | 'ROLE_FUNCIONARIO' | 'ROLE_ADMIN';

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
};

export type AuthResponse = {
  token: string;
  tokenType: string;
  user: User;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUri: string;
  category?: Category;
};

export type OrderProduct = {
  id: number;
};

export type OrderPayload = {
  address: string;
  latitude: number;
  longitude: number;
  products: OrderProduct[];
};

export type Order = {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  moment: string;
  status: 'PENDING' | 'DELIVERED' | string;
  products: Product[];
  total: number;
};

export type LocationCoords = {
  latitude: number;
  longitude: number;
};