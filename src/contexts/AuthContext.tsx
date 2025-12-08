import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, setAuthToken, getAuthToken } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  is_admin?: boolean;
  is_seller?: boolean;
  seller_status?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" || user?.is_admin === true;
  const isSeller = user?.role === "seller" || user?.is_seller === true;

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await authApi.me();
          setUser(response.user);
        } catch (error) {
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password });
      setAuthToken(response.token);
      setUser(response.user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${response.user.first_name}`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const response = await authApi.register(data);
      setAuthToken(response.token);
      setUser(response.user);
      toast({
        title: "Account created!",
        description: "Welcome to LUXE",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    }
    setAuthToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const response = await authApi.updateProfile(data);
      setUser(response.user);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Could not update profile",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        isSeller,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
