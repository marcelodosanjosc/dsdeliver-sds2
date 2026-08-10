import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse } from '../types';
import { loginApi, registerApi } from '../api';

const TOKEN_KEY = '@dsdeliver:token';
const USER_KEY = '@dsdeliver:user';

type AuthContextData = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isEmployee: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    employee?: boolean;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadStorageData();
  }, []);

  const isAuthenticated = !!token;
  const isEmployee = user?.roles?.includes('ROLE_FUNCIONARIO') ?? false;

  const login = async (credentials: { email: string; password: string }) => {
    const response = await loginApi(credentials);
    const { token: newToken, user: newUser } = response.data;

    setToken(newToken);
    setUser(newUser);

    await AsyncStorage.setItem(TOKEN_KEY, newToken);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    employee?: boolean;
  }) => {
    await registerApi(userData);
    // Realiza login automático após o cadastro
    await login({ email: userData.email, password: userData.password });
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isEmployee,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
