import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Company } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  company: Company | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User, company: Company | null) => void;
  logout: () => void;
  updateCompany: (company: Company) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bizos_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [company, setCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem('bizos_company');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bizos_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data.user);
          setCompany(res.data.company);
          localStorage.setItem('bizos_user', JSON.stringify(res.data.user));
          if (res.data.company) {
            localStorage.setItem('bizos_company', JSON.stringify(res.data.company));
          }
        })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (newToken: string, newUser: User, newCompany: Company | null) => {
    setToken(newToken);
    setUser(newUser);
    setCompany(newCompany);
    localStorage.setItem('bizos_token', newToken);
    localStorage.setItem('bizos_user', JSON.stringify(newUser));
    if (newCompany) {
      localStorage.setItem('bizos_company', JSON.stringify(newCompany));
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCompany(null);
    localStorage.removeItem('bizos_token');
    localStorage.removeItem('bizos_user');
    localStorage.removeItem('bizos_company');
  };

  const updateCompany = (updatedCompany: Company) => {
    setCompany(updatedCompany);
    localStorage.setItem('bizos_company', JSON.stringify(updatedCompany));
  };

  return (
    <AuthContext.Provider value={{ user, company, token, loading, login, logout, updateCompany }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
