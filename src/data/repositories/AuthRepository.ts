import { supabase } from '../../core/supabase/client';
import { Perfil } from '../../domain/entities';
import { AuthError, Session, User } from '@supabase/supabase-js';
import type { Database } from '../../core/supabase/database.types';

type PerfilUpdate = Database['public']['Tables']['perfiles']['Update'];

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  session?: Session | null;
  error?: string;
}

export interface ProfileResponse {
  success: boolean;
  profile?: Perfil;
  error?: string;
}

export class AuthRepository {
  // Registrar nuevo usuario
  async signUp(
    email: string, 
    password: string, 
    nombreCompleto: string
  ): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombreCompleto,
          },
        },
      });

      if (error) throw error;

      // Actualizar perfil con nombre completo
      if (data.user) {
        const updateData: PerfilUpdate = {
          nombre_completo: nombreCompleto
        };

        await supabase
          .from('perfiles')
          .update(updateData)
          .eq('id', data.user.id);
      }

      return { success: true, user: data.user, session: data.session };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  }

  // Iniciar sesión
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { 
        success: true, 
        user: data.user, 
        session: data.session 
      };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  }

  // Cerrar sesión
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  }

  // Obtener sesión actual
  async getCurrentSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Restablecer contraseña (enviar email)
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'tigoconecta://reset-password',
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  }

  // Actualizar contraseña
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  }

  // Obtener perfil del usuario
  async getProfile(userId: string): Promise<Perfil | null> {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (!data) return null;

      return new Perfil(
        data.id,
        data.email,
        data.nombre_completo,
        data.telefono,
        data.rol,
        data.avatar_url,
        new Date(data.created_at),
        new Date(data.updated_at)
      );
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  // Actualizar perfil
  async updateProfile(
    userId: string, 
    updates: {
      nombreCompleto?: string;
      telefono?: string;
      avatarUrl?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const updateData: PerfilUpdate = {
        updated_at: new Date().toISOString(),
      };

      if (updates.nombreCompleto !== undefined) {
        updateData.nombre_completo = updates.nombreCompleto;
      }
      if (updates.telefono !== undefined) {
        updateData.telefono = updates.telefono;
      }
      if (updates.avatarUrl !== undefined) {
        updateData.avatar_url = updates.avatarUrl;
      }

      const { error } = await supabase
        .from('perfiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // Listener de cambios de autenticación
  onAuthStateChange(
    callback: (event: string, session: Session | null) => void
  ): { unsubscribe: () => void } {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });

    return {
      unsubscribe: () => data.subscription.unsubscribe(),
    };
  }
}