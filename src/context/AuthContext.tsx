import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  currentUser: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (params: {
    email: string;
    password: string;
    fullName: string;
    collegeName: string;
    role: UserRole;
    adminCode?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial demo accounts
const DEMO_STUDENT: Profile = {
  id: 'usr_student_01',
  email: 'alex.rivera@campus.edu',
  full_name: 'Alex Rivera',
  college_name: 'Pacific Green University',
  role: 'student',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  public_alias: 'AlexR_Eco',
  show_on_leaderboard: true,
  created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
};

const DEMO_ADMIN: Profile = {
  id: 'usr_admin_01',
  email: 'admin.sustainability@campus.edu',
  full_name: 'Dean Eleanor Vance',
  college_name: 'Pacific Green University',
  role: 'admin',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  public_alias: 'DeanVance_Admin',
  show_on_leaderboard: false,
  created_at: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    async function initAuth() {
      setLoading(true);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await fetchProfile(session.user.id, session.user.email || '');
          } else {
            // Check if there was a local demo user session
            const localUser = localStorage.getItem('greencred_current_user');
            if (localUser) {
              setCurrentUser(JSON.parse(localUser));
            }
          }

          // Listen for auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              if (session?.user) {
                await fetchProfile(session.user.id, session.user.email || '');
              } else {
                setCurrentUser(null);
                localStorage.removeItem('greencred_current_user');
              }
            }
          );

          return () => {
            authListener.subscription.unsubscribe();
          };
        } catch (err) {
          console.error('Failed to init Supabase session:', err);
        }
      } else {
        // Local mode
        const localUser = localStorage.getItem('greencred_current_user');
        if (localUser) {
          try {
            setCurrentUser(JSON.parse(localUser));
          } catch {
            setCurrentUser(DEMO_STUDENT);
          }
        } else {
          // Default to student for instant preview
          setCurrentUser(DEMO_STUDENT);
          localStorage.setItem('greencred_current_user', JSON.stringify(DEMO_STUDENT));
        }
      }

      setLoading(false);
    }

    initAuth();
  }, []);

  async function fetchProfile(userId: string, email: string) {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        const profile: Profile = {
          ...data,
          email,
        };
        setCurrentUser(profile);
        localStorage.setItem('greencred_current_user', JSON.stringify(profile));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          await fetchProfile(data.user.id, data.user.email || email);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Login failed.' };
      }
    }

    // Local / Demo Authentication
    const storedUsersJson = localStorage.getItem('greencred_registered_users');
    const registeredUsers: Array<Profile & { passwordHash: string }> = storedUsersJson
      ? JSON.parse(storedUsersJson)
      : [];

    const found = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (found) {
      if (found.passwordHash === password) {
        const { passwordHash, ...profile } = found;
        setCurrentUser(profile);
        localStorage.setItem('greencred_current_user', JSON.stringify(profile));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid password. Please check your credentials.' };
      }
    }

    // Check predefined demo logins
    if (email.toLowerCase() === DEMO_STUDENT.email.toLowerCase()) {
      setCurrentUser(DEMO_STUDENT);
      localStorage.setItem('greencred_current_user', JSON.stringify(DEMO_STUDENT));
      return { success: true };
    }

    if (email.toLowerCase() === DEMO_ADMIN.email.toLowerCase()) {
      setCurrentUser(DEMO_ADMIN);
      localStorage.setItem('greencred_current_user', JSON.stringify(DEMO_ADMIN));
      return { success: true };
    }

    // If student@campus.edu or admin@campus.edu convenience shortcuts
    if (email.toLowerCase() === 'student@campus.edu') {
      setCurrentUser(DEMO_STUDENT);
      localStorage.setItem('greencred_current_user', JSON.stringify(DEMO_STUDENT));
      return { success: true };
    }

    if (email.toLowerCase() === 'admin@campus.edu') {
      setCurrentUser(DEMO_ADMIN);
      localStorage.setItem('greencred_current_user', JSON.stringify(DEMO_ADMIN));
      return { success: true };
    }

    return {
      success: false,
      error: 'Account not found. Please register or use the demo login buttons below.',
    };
  };

  const register = async ({
    email,
    password,
    fullName,
    collegeName,
    role,
    adminCode,
  }: {
    email: string;
    password: string;
    fullName: string;
    collegeName: string;
    role: UserRole;
    adminCode?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password || !fullName || !collegeName) {
      return { success: false, error: 'Please fill in all required fields.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Role verification: Administrator registration requires authorization code
    if (role === 'admin') {
      const requiredCode = import.meta.env.VITE_ADMIN_SECRET_KEY || 'GREEN_ADMIN_2026';
      if (!adminCode || adminCode.trim() !== requiredCode) {
        return {
          success: false,
          error: 'Invalid Administrator Authorization Key. You cannot register as an administrator without authorization.',
        };
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              college_name: collegeName.trim(),
              role,
              admin_secret: adminCode,
              public_alias: fullName.split(' ')[0] + '_Eco',
            },
          },
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Profile trigger will insert into profiles table
          const newProfile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            college_name: collegeName,
            role,
            public_alias: fullName.split(' ')[0] + '_Eco',
            show_on_leaderboard: true,
            created_at: new Date().toISOString(),
          };
          setCurrentUser(newProfile);
          localStorage.setItem('greencred_current_user', JSON.stringify(newProfile));
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message || 'Registration failed.' };
      }
    }

    // Local / Demo registration
    const storedUsersJson = localStorage.getItem('greencred_registered_users');
    const registeredUsers: Array<Profile & { passwordHash: string }> = storedUsersJson
      ? JSON.parse(storedUsersJson)
      : [];

    if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newProfile: Profile = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      full_name: fullName.trim(),
      college_name: collegeName.trim(),
      role,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
      public_alias: fullName.split(' ')[0] + '_' + Math.floor(100 + Math.random() * 900),
      show_on_leaderboard: true,
      created_at: new Date().toISOString(),
    };

    registeredUsers.push({ ...newProfile, passwordHash: password });
    localStorage.setItem('greencred_registered_users', JSON.stringify(registeredUsers));

    setCurrentUser(newProfile);
    localStorage.setItem('greencred_current_user', JSON.stringify(newProfile));

    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    setCurrentUser(null);
    localStorage.removeItem('greencred_current_user');
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid campus email address.' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/#reset-password`,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        return {
          success: true,
          message: 'Password reset link sent! Check your email inbox for instructions.',
        };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Demo mode response
    return {
      success: true,
      message: `Password reset instructions sent to ${email} (Demo simulated).`,
    };
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    const updated = { ...currentUser, ...updates, updated_at: new Date().toISOString() };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updated.full_name,
            college_name: updated.college_name,
            avatar_url: updated.avatar_url,
            public_alias: updated.public_alias,
            show_on_leaderboard: updated.show_on_leaderboard,
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentUser.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    setCurrentUser(updated);
    localStorage.setItem('greencred_current_user', JSON.stringify(updated));
    return { success: true };
  };

  const switchDemoUser = (role: UserRole) => {
    const userToSet = role === 'admin' ? DEMO_ADMIN : DEMO_STUDENT;
    setCurrentUser(userToSet);
    localStorage.setItem('greencred_current_user', JSON.stringify(userToSet));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin: currentUser?.role === 'admin',
        isStudent: currentUser?.role === 'student',
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
