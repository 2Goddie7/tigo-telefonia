import { create } from 'zustand';
import { Contratacion, CreateContratacionDTO, UpdateContratacionDTO } from '../../domain/entities';
import { ContratacionesRepository } from '../../data/repositories/ContratacionesRepository';
import { NotificationsService } from '../../data/services/NotificationsService';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ContratacionesState {
  // Estado
  contrataciones: Contratacion[];
  contratacionesPendientes: Contratacion[];
  selectedContratacion: Contratacion | null;
  isLoading: boolean;
  realtimeChannel: RealtimeChannel | null;

  // Acciones
  setContrataciones: (contrataciones: Contratacion[]) => void;
  setContratacionesPendientes: (contrataciones: Contratacion[]) => void;
  setSelectedContratacion: (contratacion: Contratacion | null) => void;
  setLoading: (loading: boolean) => void;

  // Métodos
  fetchUserContrataciones: (usuarioId: string) => Promise<void>;
  fetchAllContrataciones: () => Promise<void>;
  fetchContratacionesPendientes: () => Promise<void>;
  fetchContratacionById: (id: string) => Promise<Contratacion | null>;
  createContratacion: (usuarioId: string, dto: CreateContratacionDTO) => Promise<{ success: boolean; error?: string }>;
  updateContratacion: (id: string, asesorId: string, dto: UpdateContratacionDTO) => Promise<{ success: boolean; error?: string }>;

  // Realtime
  subscribeToContrataciones: () => void;
  subscribeToUserContrataciones: (usuarioId: string) => void;
  unsubscribeFromContrataciones: () => void;
}

const contratacionesRepository = new ContratacionesRepository();
const notificationsService = NotificationsService.getInstance();

export const useContratacionesStore = create<ContratacionesState>((set, get) => ({
  // Estado inicial
  contrataciones: [],
  contratacionesPendientes: [],
  selectedContratacion: null,
  isLoading: false,
  realtimeChannel: null,

  // Setters
  setContrataciones: (contrataciones) => set({ contrataciones }),
  setContratacionesPendientes: (contrataciones) => set({ contratacionesPendientes: contrataciones }),
  setSelectedContratacion: (contratacion) => set({ selectedContratacion: contratacion }),
  setLoading: (loading) => set({ isLoading: loading }),

  // Obtener contrataciones de un usuario
  fetchUserContrataciones: async (usuarioId) => {
    try {
      set({ isLoading: true });
      const contrataciones = await contratacionesRepository.getContratacionesByUsuario(usuarioId);
      set({ contrataciones });
    } catch (error) {
      console.error('Error fetching user contrataciones:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Obtener todas las contrataciones (asesores)
  fetchAllContrataciones: async () => {
    try {
      set({ isLoading: true });
      const contrataciones = await contratacionesRepository.getAllContrataciones();
      set({ contrataciones });
    } catch (error) {
      console.error('Error fetching all contrataciones:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Obtener contrataciones pendientes (asesores)
  fetchContratacionesPendientes: async () => {
    try {
      set({ isLoading: true });
      const contrataciones = await contratacionesRepository.getContratacionesPendientes();
      set({ contratacionesPendientes: contrataciones });
    } catch (error) {
      console.error('Error fetching pending contrataciones:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Obtener una contratación por ID
  fetchContratacionById: async (id) => {
    try {
      set({ isLoading: true });
      const contratacion = await contratacionesRepository.getContratacionById(id);
      if (contratacion) {
        set({ selectedContratacion: contratacion });
      }
      return contratacion;
    } catch (error) {
      console.error('Error fetching contratacion:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Crear contratación
  createContratacion: async (usuarioId, dto) => {
    try {
      const result = await contratacionesRepository.createContratacion(usuarioId, dto);
      
      if (result.success && result.contratacion) {
        // Notificar al usuario
        await notificationsService.scheduleLocalNotification(
          '✅ Solicitud Enviada',
          'Tu solicitud de contratación ha sido enviada correctamente.',
          { type: 'contratacion_created' }
        );
        
        // Refrescar lista
        await get().fetchUserContrataciones(usuarioId);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Actualizar contratación (aprobar/rechazar)
  updateContratacion: async (id, asesorId, dto) => {
    try {
      const result = await contratacionesRepository.updateContratacion(id, asesorId, dto);
      
      if (result.success && result.contratacion) {
        const contratacion = result.contratacion;
        
        // Enviar notificaciones según el estado
        if (dto.estado === 'aprobada' && contratacion.plan) {
          await notificationsService.notifyContratacionApproved(
            contratacion.plan.nombre,
            contratacion.id
          );
        } else if (dto.estado === 'rechazada' && contratacion.plan) {
          await notificationsService.notifyContratacionRejected(
            contratacion.plan.nombre,
            contratacion.id
          );
        }
        
        // Refrescar listas
        await get().fetchAllContrataciones();
        await get().fetchContratacionesPendientes();
      }
      
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Suscribirse a cambios en todas las contrataciones
  subscribeToContrataciones: () => {
    const channel = contratacionesRepository.subscribeToContrataciones((payload) => {
      console.log('Contrataciones realtime event:', payload);
      
      // Notificar nueva contratación a asesores
      if (payload.eventType === 'INSERT' && payload.new) {
        const newContratacion = payload.new;
        // Aquí podrías agregar lógica adicional para notificar
      }
      
      // Refrescar listas
      get().fetchAllContrataciones();
      get().fetchContratacionesPendientes();
    });
    
    set({ realtimeChannel: channel });
  },

  // Suscribirse a contrataciones de un usuario específico
  subscribeToUserContrataciones: (usuarioId) => {
    const channel = contratacionesRepository.subscribeToUserContrataciones(
      usuarioId,
      (payload) => {
        console.log('User contrataciones realtime event:', payload);
        
        // Notificar cambios de estado al usuario
        if (payload.eventType === 'UPDATE' && payload.new) {
          const updatedContratacion = payload.new;
          if (updatedContratacion.estado === 'aprobada') {
            notificationsService.scheduleLocalNotification(
              '✅ Contratación Aprobada',
              'Tu solicitud ha sido aprobada.',
              { type: 'contratacion_updated' }
            );
          } else if (updatedContratacion.estado === 'rechazada') {
            notificationsService.scheduleLocalNotification(
              '❌ Contratación Rechazada',
              'Tu solicitud ha sido rechazada.',
              { type: 'contratacion_updated' }
            );
          }
        }
        
        // Refrescar lista
        get().fetchUserContrataciones(usuarioId);
      }
    );
    
    set({ realtimeChannel: channel });
  },

  // Desuscribirse de cambios
  unsubscribeFromContrataciones: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
      set({ realtimeChannel: null });
    }
  },
}));