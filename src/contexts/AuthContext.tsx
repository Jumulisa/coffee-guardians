import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from '../lib/supabase';
import { getUserProfile, getUserSettings } from '../lib/db-service';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  language?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (full_name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: { full_name?: string; avatar_url?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch extended user profile from database
          let profile, settings;
          try {
            profile = await getUserProfile(session.user.id);
          } catch (e) {
            if (e instanceof Error && e.message.includes("AbortError")) {
              throw new Error("Network request was interrupted. Please check your connection and try again.");
            }
            throw e;
          }
          try {
            settings = await getUserSettings(session.user.id);
          } catch (e) {
            if (e instanceof Error && e.message.includes("AbortError")) {
              throw new Error("Network request was interrupted. Please check your connection and try again.");
            }
            throw e;
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || null,
            avatar_url: profile?.avatar_url || null,
            language: settings?.language || 'en',
            createdAt: session.user.created_at || new Date().toISOString(),
          });
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes("AbortError")) {
          // Optionally, you could set a global error state here
          console.error('Network request was interrupted. Please check your connection and try again.');
        } else {
          console.error('Error initializing auth:', error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          let profile, settings;
          try {
            profile = await getUserProfile(session.user.id);
          } catch (e) {
            if (e instanceof Error && e.message.includes("AbortError")) {
              throw new Error("Network request was interrupted. Please check your connection and try again.");
            }
            throw e;
          }
          try {
            settings = await getUserSettings(session.user.id);
          } catch (e) {
            if (e instanceof Error && e.message.includes("AbortError")) {
              throw new Error("Network request was interrupted. Please check your connection and try again.");
            }
            throw e;
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: profile?.full_name || null,
            avatar_url: profile?.avatar_url || null,
            language: settings?.language || 'en',
            createdAt: session.user.created_at || new Date().toISOString(),
          });
        } catch (error) {
          if (error instanceof Error && error.message.includes("AbortError")) {
            console.error('Network request was interrupted. Please check your connection and try again.');
          } else {
            console.error('Error updating user profile:', error);
          }
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Custom error for AbortError
        if (error.message && error.message.includes("AbortError")) {
          throw new Error("Network request was interrupted. Please check your connection and try again.");
        }
        throw new Error(error.message);
      }

      if (data.user) {
        try {
          let profile;
          try {
            profile = await getUserProfile(data.user.id);
          } catch (e) {
            // If profile missing, create it
            const { error: insertError } = await supabase.from('profiles').insert([
              {
                id: data.user.id,
                email: data.user.email,
                full_name: null,
                language: 'en',
                notifications_enabled: true,
              },
            ]);
            if (insertError) throw insertError;
            profile = await getUserProfile(data.user.id);
          }

          let settings;
          try {
            settings = await getUserSettings(data.user.id);
          } catch (e) {
            // If settings missing, create them
            const { error: insertError } = await supabase.from('user_settings').insert([
              {
                user_id: data.user.id,
                language: 'en',
                notifications_enabled: true,
                theme_preference: 'light',
                auto_save_history: true,
              },
            ]);
            if (insertError) throw insertError;
            settings = await getUserSettings(data.user.id);
          }

          setUser({
            id: data.user.id,
            email: data.user.email || '',
            full_name: profile?.full_name || null,
            avatar_url: profile?.avatar_url || null,
            language: settings?.language || 'en',
            createdAt: data.user.created_at || new Date().toISOString(),
          });
        } catch (profileError) {
          console.error('Error loading or creating profile/settings:', profileError);
        }
      }
    } catch (err) {
      // If error is AbortError from fetch, show user-friendly message
      if (err instanceof Error && err.message.includes("AbortError")) {
        throw new Error("Network request was interrupted. Please check your connection and try again.");
      }
      throw err;
    }
  }, []);

  const signup = useCallback(async (full_name: string, email: string, password: string) => {
    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message && authError.message.includes("AbortError")) {
          throw new Error("Network request was interrupted. Please check your connection and try again.");
        }
        throw new Error(authError.message);
      }

      if (authData.user) {
        try {
          // Create profile in database
          const { error: profileError } = await supabase.from('profiles').insert([
            {
              id: authData.user.id,
              email,
              full_name,
              language: 'en',
              notifications_enabled: true,
            },
          ]);

          if (profileError) {
            throw new Error(profileError.message);
          }

          // Create default settings
          const { error: settingsError } = await supabase.from('user_settings').insert([
            {
              user_id: authData.user.id,
              language: 'en',
              notifications_enabled: true,
              theme_preference: 'light',
              auto_save_history: true,
            },
          ]);

          if (settingsError) {
            throw new Error(settingsError.message);
          }

          // Don't auto-login on signup - user must sign in manually
          // This gives them time to verify their email if needed
        } catch (dbError) {
          // If error is AbortError from fetch, show user-friendly message
          if (dbError instanceof Error && dbError.message.includes("AbortError")) {
            throw new Error("Network request was interrupted. Please check your connection and try again.");
          }
          console.error('Error creating user profile:', dbError);
          throw dbError;
        }
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("AbortError")) {
        throw new Error("Network request was interrupted. Please check your connection and try again.");
      }
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
  }, []);

  const updateProfile = useCallback(async (updates: { full_name?: string; avatar_url?: string }) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    setUser({
      ...user,
      ...updates,
    });
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
