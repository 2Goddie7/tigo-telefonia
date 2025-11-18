import { create } from 'zustand';
import { PlanMovil, CreatePlanDTO } from '../../domain/entities';
import { PlanesRepository } from '../../data/repositories/PlanesRepository';
import { RealtimeChannel } from '@supabase/supabase-js';

interface PlanesState {
  // Estado
  planes: PlanMovil[];
  selectedPlan: PlanMovil | null;
  isLoading: boolean;
  searchQuery: string;
  priceFilter: { min: number; max: number } | null;
  realtimeChannel: RealtimeChannel | null;

  // Acciones
  setPlanes: (planes: PlanMovil[]) => void;
  setSelectedPlan: (plan: PlanMovil | null) => void;
  setLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPriceFilter: (filter: { min: number; max: number } | null) => void;

  // Métodos
  fetchPlanes: () => Promise<void>;
  fetchPlanById: (id: string) => Promise<PlanMovil | null>;
  searchPlanes: (query: string) => Promise<void>;
  filterByPrice: (min: number, max: number) => Promise<void>;
  createPlan: (planData: CreatePlanDTO, imageUri?: string | null) => Promise<{ success: boolean; error?: string }>;
  updatePlan: (id: string, planData: Partial<CreatePlanDTO> & { imagenUrl?: string | null }, imageUri?: string | null) => Promise<{ success: boolean; error?: string }>;
  deletePlan: (id: string) => Promise<{ success: boolean; error?: string }>;
  pickImage: () => Promise<string | null>;
  
  // Realtime
  subscribeToPlanes: () => void;
  unsubscribeFromPlanes: () => void;

  // Helpers
  clearFilters: () => Promise<void>;
}

const planesRepository = new PlanesRepository();

export const usePlanesStore = create<PlanesState>((set, get) => ({
  // Estado inicial
  planes: [],
  selectedPlan: null,
  isLoading: false,
  searchQuery: '',
  priceFilter: null,
  realtimeChannel: null,

  // Setters
  setPlanes: (planes) => set({ planes }),
  setSelectedPlan: (plan) => set({ selectedPlan: plan }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPriceFilter: (filter) => set({ priceFilter: filter }),

  // Obtener todos los planes
  fetchPlanes: async () => {
    try {
      set({ isLoading: true });
      const planes = await planesRepository.getPlanes();
      set({ planes });
    } catch (error) {
      console.error('Error fetching planes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Obtener un plan por ID
  fetchPlanById: async (id) => {
    try {
      set({ isLoading: true });
      const plan = await planesRepository.getPlanById(id);
      if (plan) {
        set({ selectedPlan: plan });
      }
      return plan;
    } catch (error) {
      console.error('Error fetching plan:', error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Buscar planes
  searchPlanes: async (query) => {
    try {
      set({ isLoading: true, searchQuery: query });
      if (query.trim() === '') {
        await get().fetchPlanes();
      } else {
        const planes = await planesRepository.searchPlanes(query);
        set({ planes });
      }
    } catch (error) {
      console.error('Error searching planes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Filtrar por precio
  filterByPrice: async (min, max) => {
    try {
      set({ isLoading: true, priceFilter: { min, max } });
      const planes = await planesRepository.filterPlanesByPrice(min, max);
      set({ planes });
    } catch (error) {
      console.error('Error filtering planes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Crear plan
  createPlan: async (planData, imageUri) => {
    try {
      const result = await planesRepository.createPlan(planData, imageUri);
      if (result.success) {
        await get().fetchPlanes();
      }
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Actualizar plan
  updatePlan: async (id, planData, imageUri) => {
    try {
      const result = await planesRepository.updatePlan(id, planData, imageUri);
      if (result.success) {
        await get().fetchPlanes();
      }
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Eliminar plan
  deletePlan: async (id) => {
    try {
      const result = await planesRepository.deletePlan(id);
      if (result.success) {
        await get().fetchPlanes();
      }
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Seleccionar imagen
  pickImage: async () => {
    try {
      return await planesRepository.pickImage();
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  },

  // Suscribirse a cambios en tiempo real
  subscribeToPlanes: () => {
    const channel = planesRepository.subscribeToPlanes((payload) => {
      console.log('Planes realtime event:', payload);
      // Refrescar planes cuando hay cambios
      get().fetchPlanes();
    });
    
    set({ realtimeChannel: channel });
  },

  // Desuscribirse de cambios
  unsubscribeFromPlanes: () => {
    const { realtimeChannel } = get();
    if (realtimeChannel) {
      realtimeChannel.unsubscribe();
      set({ realtimeChannel: null });
    }
  },

  // Limpiar filtros
  clearFilters: async () => {
    set({ searchQuery: '', priceFilter: null });
    await get().fetchPlanes();
  },
}));