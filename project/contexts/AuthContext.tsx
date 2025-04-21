import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  userType: UserType;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  setUserType: (type: UserType) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  userType: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUserType: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<UserType>(null);

  // Simulated auth loading effect
  useEffect(() => {
    const loadUser = async () => {
      try {
        // In a real app, you would check for a stored token
        // and fetch the user profile if authenticated
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load user:', error);
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      setIsLoading(true);
      // Mock response
      const mockUser: User = {
        id: '123',
        name: 'John Doe',
        email: email,
        phone: '+1234567890',
        userType: userType || 'worker',
        profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      // Mock registration
      const mockUser: User = {
        id: '123',
        name: name,
        email: email,
        phone: '',
        userType: userType || 'worker',
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      setIsLoading(false);
    } catch (error) {
      console.error('Registration failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        userType,
        login,
        register,
        logout,
        setUserType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};