import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for each role
const demoUsers: Record<UserRole, User> = {
  patient: {
    id: 'p1',
    email: 'patient@careflow.ai',
    name: 'Sarah Johnson',
    role: 'patient',
    avatar: 'SJ'
  },
  pcp: {
    id: 'pcp1',
    email: 'doctor@careflow.ai',
    name: 'Dr. Michael Chen',
    role: 'pcp',
    avatar: 'MC'
  },
  specialist: {
    id: 's1',
    email: 'specialist@careflow.ai',
    name: 'Dr. Emily Rodriguez',
    role: 'specialist',
    avatar: 'ER'
  },
  admin: {
    id: 'a1',
    email: 'admin@careflow.ai',
    name: 'James Wilson',
    role: 'admin',
    avatar: 'JW'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setUser(demoUsers[role]);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading
    }}>
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
