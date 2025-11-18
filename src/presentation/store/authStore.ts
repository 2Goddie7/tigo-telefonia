import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { Perfil } from '../../domain/entities';
import { AuthRepository } from '../../data/repositories/AuthRepository';

interface AuthState {
  // Estado
  user: User | null;
  session: Session | null;
  profile: Perfil | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Acciones
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Perfil | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Métodos de autenticación
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, nombreCompleto: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: { nombreCompleto?: string; telefono?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  
  // Helpers
  isAsesor: () => boolean;
  isUsuario: () => boolean;
}

const authRepository = new AuthRepository();

export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,

  // Setters
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Inicializar: Verificar sesión existente
  initialize: async () => {
    try {
      set({ isLoading: true });
      
      const session = await authRepository.getCurrentSession();
      
      if (session) {
        const profile = await authRepository.getProfile(session.user.id);
        set({
          user: session.user,
          session,
          profile,
          isAuthenticated: true,
        });
      } else {
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Iniciar sesión
  signIn: async (email, password) => {
    try {
      const result = await authRepository.signIn(email, password);
      
      if (result.success && result.user && result.session) {
        const profile = await authRepository.getProfile(result.user.id);
        set({
          user: result.user,
          session: result.session,
          profile,
          isAuthenticated: true,
        });
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Registrarse
  signUp: async (email, password, nombreCompleto) => {
    try {
      const result = await authRepository.signUp(email, password, nombreCompleto);
      
      if (result.success && result.user) {
        // Obtener el perfil recién creado
        const profile = await authRepository.getProfile(result.user.id);
        
        // Auto login después del registro
        const loginResult = await authRepository.signIn(email, password);
        
        if (loginResult.success && loginResult.session) {
          set({
            user: loginResult.user,
            session: loginResult.session,
            profile,
            isAuthenticated: true,
          });
        }
        
        return { success: true };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Cerrar sesión
  signOut: async () => {
    try {
      await authRepository.signOut();
      set({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  // Restablecer contraseña
  resetPassword: async (email) => {
    try {
      const result = await authRepository.resetPassword(email);
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Actualizar contraseña
  updatePassword: async (newPassword) => {
    try {
      const result = await authRepository.updatePassword(newPassword);
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Refrescar perfil
  refreshProfile: async () => {
    try {
      const { user } = get();
      if (!user) return;
      
      const profile = await authRepository.getProfile(user.id);
      set({ profile });
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  },

  // Actualizar perfil
  updateProfile: async (updates) => {
    try {
      const { user } = get();
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
      }
      
      const result = await authRepository.updateProfile(user.id, updates);
      
      if (result.success) {
        await get().refreshProfile();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Helpers
  isAsesor: () => {
    const { profile } = get();
    return profile?.esAsesor || false;
  },

  isUsuario: () => {
    const { profile } = get();
    return profile?.esUsuario || false;
  },
}));