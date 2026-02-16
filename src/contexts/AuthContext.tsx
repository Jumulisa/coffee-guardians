import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, location?: string, phone?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("coffee-guardian-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("coffee-guardian-user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email && password.length >= 6) {
          const newUser: User = {
            id: `user-${Date.now()}`,
            name: email.split("@")[0],
            email,
            createdAt: new Date().toISOString(),
          };
          setUser(newUser);
          localStorage.setItem("coffee-guardian-user", JSON.stringify(newUser));
          resolve();
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1000);
    });
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string, location?: string, phone?: string) => {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (name && email && password.length >= 6) {
            const newUser: User = {
              id: `user-${Date.now()}`,
              name,
              email,
              location,
              phone,
              createdAt: new Date().toISOString(),
            };
            setUser(newUser);
            localStorage.setItem("coffee-guardian-user", JSON.stringify(newUser));
            resolve();
          } else {
            reject(new Error("Invalid form data"));
          }
        }, 1000);
      });
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("coffee-guardian-user");
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Mock password reset email
        console.log(`Password reset email sent to ${email}`);
        resolve();
      }, 1500);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
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
