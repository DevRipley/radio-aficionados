'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  // Credenciales hardcodeadas
  const VALID_USERNAME = 'H14NLE';
  const VALID_PASSWORD = 'Radioaficionado';

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedAuth = localStorage.getItem('radio-auth');
    const savedUser = localStorage.getItem('radio-user');
    const savedToken = localStorage.getItem('radio-auth-token');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(savedUser);
      
      // Si no hay token guardado pero hay sesión, recrear el token
      if (!savedToken && savedUser === VALID_USERNAME) {
        const token = btoa(`${VALID_USERNAME}:${VALID_PASSWORD}`);
        localStorage.setItem('radio-auth-token', token);
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setUser(username);
      localStorage.setItem('radio-auth', 'true');
      localStorage.setItem('radio-user', username);
      
      // Crear y guardar token de autenticación
      const token = btoa(`${username}:${password}`);
      localStorage.setItem('radio-auth-token', token);
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('radio-auth');
    localStorage.removeItem('radio-user');
    localStorage.removeItem('radio-auth-token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
