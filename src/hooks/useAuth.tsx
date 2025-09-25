import { useState, createContext, useContext, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  managerLogin: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: loggedInUser } = await authService.userLogin(email, password);

      setUser({
        id: String(loggedInUser.id),
        email: loggedInUser.email,
        name: (loggedInUser as any).name || loggedInUser.email,
        role: loggedInUser.role === 'ADMIN' ? 'admin' : loggedInUser.role,
        createdAt: (loggedInUser as any).createdAt || new Date().toISOString(),
      });
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  const managerLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user } = await authService.managerLogin(email, password);
      setUser({
        id: String(user.id),
        email: user.email,
        name: (user as any).name || user.email,
        role: 'manager',
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, phone: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user: newUser } = await authService.signupuser(email, name, phone, password);
      setUser({
        id: String(newUser.id),
        email: newUser.email,
        name: newUser.username || newUser.email,
        role: 'user',
        phone: newUser.phone || '',
        password: newUser.password,
        createdAt: (newUser as any).createdAt || new Date().toISOString(),
      });
      return true;
    } catch (e) {   
    return false;
    } finally {
      setIsLoading(false);
    }

  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { user } = await authService.adminLogin(email, password);
      setUser({
        id: String(user.id),
        email: user.email,
        name: (user as any).name || user.email,
        role: 'admin',
        createdAt: new Date().toISOString(),
      });
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, signup, logout,managerLogin, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};