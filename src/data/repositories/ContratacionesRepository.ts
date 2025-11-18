import { supabase } from '../../core/supabase/client';
import { Contratacion, PlanMovil, Perfil, CreateContratacionDTO, UpdateContratacionDTO } from '../../domain/entities';
import { RealtimeChannel } from '@supabase/supabase-js';
import { EstadoContratacion } from '../../core/supabase/database.types';

export interface ContratacionResponse {
  success: boolean;
  contratacion?: Contratacion;
  error?: string;
}

export class ContratacionesRepository {
  // Crear nueva contratación
  async createContratacion(
    usuarioId: string,
    dto: CreateContratacionDTO
  ): Promise<ContratacionResponse> {
    try {
      const { data, error } = await supabase
        .from('contrataciones')
        .insert([{
          usuario_id: usuarioId,
          plan_id: dto.planId,
          estado: 'pendiente' as EstadoContratacion,
          notas: dto.notas || null,
          fecha_contratacion: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No se pudo crear la contratación');

      return {
        success: true,
        contratacion: this._mapToContratacion(data),
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  // Obtener contrataciones de un usuario
  async getContratacionesByUsuario(usuarioId: string): Promise<Contratacion[]> {
    try {
      const { data, error } = await supabase
        .from('contrataciones')
        .select(`
          *,
          plan:planes_moviles(*),
          asesor:perfiles!contrataciones_asesor_id_fkey(*)
        `)
        .eq('usuario_id', usuarioId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => this._mapToContratacionWithRelations(item));
    } catch (error) {
      console.error('Error getting contrataciones:', error);
      return [];
    }
  }

  // Obtener todas las contrataciones (para asesores)
  async getAllContrataciones(): Promise<Contratacion[]> {
    try {
      const { data, error } = await supabase
        .from('contrataciones')
        .select(`
          *,
          plan:planes_moviles(*),
          usuario:perfiles!contrataciones_usuario_id_fkey(*),
          asesor:perfiles!contrataciones_asesor_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => this._mapToContratacionWithRelations(item));
    } catch (error) {
      console.error('Error getting all contrataciones:', error);
      return [];
    }
  }

  // Obtener contrataciones pendientes (para asesores)
  async getContratacionesPendientes(): Promise<Contratacion[]> {
    try {
      const { data, error } = await supabase
        .from('contrataciones')
        .select(`
          *,
          plan:planes_moviles(*),
          usuario:perfiles!contrataciones_usuario_id_fkey(*)
        `)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(item => this._mapToContratacionWithRelations(item));
    } catch (error) {
      console.error('Error getting contrataciones pendientes:', error);
      return [];
    }
  }

  // Obtener una contratación por ID
  async getContratacionById(id: string): Promise<Contratacion | null> {
    try {
      const { data, error } = await supabase
        .from('contrataciones')
        .select(`
          *,
          plan:planes_moviles(*),
          usuario:perfiles!contrataciones_usuario_id_fkey(*),
          asesor:perfiles!contrataciones_asesor_id_fkey(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return this._mapToContratacionWithRelations(data);
    } catch (error) {
      console.error('Error getting contratacion:', error);
      return null;
    }
  }

  // Actualizar contratación (aprobar/rechazar)
  async updateContratacion(
    id: string,
    asesorId: string,
    dto: UpdateContratacionDTO
  ): Promise<ContratacionResponse> {
    try {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (dto.estado !== undefined) {
        updateData.estado = dto.estado;
        if (dto.estado !== 'pendiente') {
          updateData.fecha_aprobacion = new Date().toISOString();
          updateData.asesor_id = asesorId;
        }
      }

      if (dto.notas !== undefined) {
        updateData.notas = dto.notas;
      }

      const { data, error } = await supabase
        .from('contrataciones')
        .update(updateData)
        .eq('id', id)
        .select(`
          *,
          plan:planes_moviles(*),
          usuario:perfiles!contrataciones_usuario_id_fkey(*),
          asesor:perfiles!contrataciones_asesor_id_fkey(*)
        `)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No se pudo actualizar la contratación');

      return {
        success: true,
        contratacion: this._mapToContratacionWithRelations(data),
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  // Suscribirse a cambios en contrataciones
  subscribeToContrataciones(callback: (payload: any) => void): RealtimeChannel {
    const channel = supabase
      .channel('contrataciones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contrataciones',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // Suscribirse a contrataciones de un usuario específico
  subscribeToUserContrataciones(
    usuarioId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`user_contrataciones_${usuarioId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contrataciones',
          filter: `usuario_id=eq.${usuarioId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // Mapear datos básicos a entidad
  private _mapToContratacion(data: any): Contratacion {
    return new Contratacion(
      data.id,
      data.usuario_id,
      data.plan_id,
      data.estado,
      new Date(data.fecha_contratacion),
      data.fecha_aprobacion ? new Date(data.fecha_aprobacion) : null,
      data.asesor_id,
      data.notas,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  // Mapear datos con relaciones a entidad
  private _mapToContratacionWithRelations(data: any): Contratacion {
    let plan: PlanMovil | undefined;
    let usuario: Perfil | undefined;
    let asesor: Perfil | undefined;

    if (data.plan) {
      plan = new PlanMovil(
        data.plan.id,
        data.plan.nombre,
        data.plan.precio,
        data.plan.datos_gb,
        data.plan.minutos,
        data.plan.sms,
        data.plan.velocidad_4g,
        data.plan.velocidad_5g,
        data.plan.redes_sociales,
        data.plan.whatsapp,
        data.plan.llamadas_internacionales,
        data.plan.roaming,
        data.plan.segmento,
        data.plan.publico_objetivo,
        data.plan.imagen_url,
        data.plan.activo,
        new Date(data.plan.created_at),
        new Date(data.plan.updated_at)
      );
    }

    if (data.usuario) {
      usuario = new Perfil(
        data.usuario.id,
        data.usuario.email,
        data.usuario.nombre_completo,
        data.usuario.telefono,
        data.usuario.rol,
        data.usuario.avatar_url,
        new Date(data.usuario.created_at),
        new Date(data.usuario.updated_at)
      );
    }

    if (data.asesor) {
      asesor = new Perfil(
        data.asesor.id,
        data.asesor.email,
        data.asesor.nombre_completo,
        data.asesor.telefono,
        data.asesor.rol,
        data.asesor.avatar_url,
        new Date(data.asesor.created_at),
        new Date(data.asesor.updated_at)
      );
    }

    return new Contratacion(
      data.id,
      data.usuario_id,
      data.plan_id,
      data.estado,
      new Date(data.fecha_contratacion),
      data.fecha_aprobacion ? new Date(data.fecha_aprobacion) : null,
      data.asesor_id,
      data.notas,
      new Date(data.created_at),
      new Date(data.updated_at),
      plan,
      usuario,
      asesor
    );
  }
}