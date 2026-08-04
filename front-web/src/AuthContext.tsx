import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'ROLE_CLIENTE' | 'ROLE_FUNCIONARIO';

export type UserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  roles: UserRole[];
};

type AuthContextData = {
  token: string | null;
  user: UserData | null;
  isAuthenticated: boolean;
  isEmployee: boolean;
  login: (token: string, user: UserData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserData | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!token;
  const isEmployee = user?.roles?.includes('ROLE_FUNCIONARIO') ?? false;

  const login = (newToken: string, newUser: UserData) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isEmployee, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
