import { supabase } from '../../core/supabase/client';
import { PlanMovil, CreatePlanDTO } from '../../domain/entities';
import * as ImagePicker from 'expo-image-picker';
import { RealtimeChannel } from '@supabase/supabase-js';
import type { Database } from '../../core/supabase/database.types';

type PlanRow = Database['public']['Tables']['planes_moviles']['Row'];
type PlanInsert = Database['public']['Tables']['planes_moviles']['Insert'];
type PlanUpdate = Database['public']['Tables']['planes_moviles']['Update'];

export class PlanesRepository {
  // GET ALL PLANES
  async getPlanes(): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
        .eq('activo', true)
        .order('precio', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => new PlanMovil(
        plan.id,
        plan.nombre,
        plan.precio,
        plan.datos_gb,
        plan.minutos,
        plan.sms,
        plan.velocidad_4g,
        plan.velocidad_5g,
        plan.redes_sociales,
        plan.whatsapp,
        plan.llamadas_internacionales,
        plan.roaming,
        plan.segmento,
        plan.publico_objetivo,
        plan.imagen_url,
        plan.activo,
        new Date(plan.created_at),
        new Date(plan.updated_at)
      ));
    } catch (error) {
      console.error('Error getting planes:', error);
      return [];
    }
  }

  // GET BY ID
  async getPlanById(id: string): Promise<PlanMovil | null> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return new PlanMovil(
        data.id,
        data.nombre,
        data.precio,
        data.datos_gb,
        data.minutos,
        data.sms,
        data.velocidad_4g,
        data.velocidad_5g,
        data.redes_sociales,
        data.whatsapp,
        data.llamadas_internacionales,
        data.roaming,
        data.segmento,
        data.publico_objetivo,
        data.imagen_url,
        data.activo,
        new Date(data.created_at),
        new Date(data.updated_at)
      );
    } catch (error) {
      console.error('Error getting plan:', error);
      return null;
    }
  }

  // SEARCH
  async searchPlanes(query: string): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
        .eq('activo', true)
        .or(`nombre.ilike.%${query}%,segmento.ilike.%${query}%,publico_objetivo.ilike.%${query}%`)
        .order('precio', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => new PlanMovil(
        plan.id,
        plan.nombre,
        plan.precio,
        plan.datos_gb,
        plan.minutos,
        plan.sms,
        plan.velocidad_4g,
        plan.velocidad_5g,
        plan.redes_sociales,
        plan.whatsapp,
        plan.llamadas_internacionales,
        plan.roaming,
        plan.segmento,
        plan.publico_objetivo,
        plan.imagen_url,
        plan.activo,
        new Date(plan.created_at),
        new Date(plan.updated_at)
      ));
    } catch (error) {
      console.error('Error searching planes:', error);
      return [];
    }
  }

  // FILTER BY PRICE
  async filterPlanesByPrice(minPrice: number, maxPrice: number): Promise<PlanMovil[]> {
    try {
      const { data, error } = await supabase
        .from('planes_moviles')
        .select('*')
        .eq('activo', true)
        .gte('precio', minPrice)
        .lte('precio', maxPrice)
        .order('precio', { ascending: true });

      if (error) throw error;

      return (data || []).map(plan => new PlanMovil(
        plan.id,
        plan.nombre,
        plan.precio,
        plan.datos_gb,
        plan.minutos,
        plan.sms,
        plan.velocidad_4g,
        plan.velocidad_5g,
        plan.redes_sociales,
        plan.whatsapp,
        plan.llamadas_internacionales,
        plan.roaming,
        plan.segmento,
        plan.publico_objetivo,
        plan.imagen_url,
        plan.activo,
        new Date(plan.created_at),
        new Date(plan.updated_at)
      ));
    } catch (error) {
      console.error('Error filtering planes:', error);
      return [];
    }
  }

  // CREATE PLAN
  async createPlan(
    planData: CreatePlanDTO,
    imageUri?: string | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let imagenUrl: string | null = null;

      if (imageUri) {
        const uploadResult = await this.uploadImage(imageUri);
        if (uploadResult.success && uploadResult.url) {
          imagenUrl = uploadResult.url;
        } else {
          return { success: false, error: uploadResult.error };
        }
      }

      const insertData: PlanInsert = {
        nombre: planData.nombre,
        precio: planData.precio,
        datos_gb: planData.datosGb,
        minutos: planData.minutos,
        sms: planData.sms,
        velocidad_4g: planData.velocidad4g,
        velocidad_5g: planData.velocidad5g || null,
        redes_sociales: planData.redesSociales,
        whatsapp: planData.whatsapp,
        llamadas_internacionales: planData.llamadasInternacionales,
        roaming: planData.roaming,
        segmento: planData.segmento,
        publico_objetivo: planData.publicoObjetivo,
        imagen_url: imagenUrl,
        activo: true,
      };

      const { error } = await supabase
        .from('planes_moviles')
        .insert(insertData);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // UPDATE PLAN
  async updatePlan(
    id: string,
    planData: Partial<CreatePlanDTO> & { imagenUrl?: string | null },
    imageUri?: string | null
  ): Promise<{ success: boolean; error?: string }> {
    try {
      let imagenUrl = planData.imagenUrl;

      if (imageUri) {
        const uploadResult = await this.uploadImage(imageUri);
        if (uploadResult.success && uploadResult.url) {
          imagenUrl = uploadResult.url;
        } else {
          return { success: false, error: uploadResult.error };
        }
      }

      const updateData: PlanUpdate = {
        updated_at: new Date().toISOString(),
      };

      if (planData.nombre !== undefined) updateData.nombre = planData.nombre;
      if (planData.precio !== undefined) updateData.precio = planData.precio;
      if (planData.datosGb !== undefined) updateData.datos_gb = planData.datosGb;
      if (planData.minutos !== undefined) updateData.minutos = planData.minutos;
      if (planData.sms !== undefined) updateData.sms = planData.sms;
      if (planData.velocidad4g !== undefined) updateData.velocidad_4g = planData.velocidad4g;
      if (planData.velocidad5g !== undefined) updateData.velocidad_5g = planData.velocidad5g;
      if (planData.redesSociales !== undefined) updateData.redes_sociales = planData.redesSociales;
      if (planData.whatsapp !== undefined) updateData.whatsapp = planData.whatsapp;
      if (planData.llamadasInternacionales !== undefined) updateData.llamadas_internacionales = planData.llamadasInternacionales;
      if (planData.roaming !== undefined) updateData.roaming = planData.roaming;
      if (planData.segmento !== undefined) updateData.segmento = planData.segmento;
      if (planData.publicoObjetivo !== undefined) updateData.publico_objetivo = planData.publicoObjetivo;
      if (imagenUrl !== undefined) updateData.imagen_url = imagenUrl;

      const { error } = await supabase
        .from('planes_moviles')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // DELETE PLAN
  async deletePlan(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('planes_moviles')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // PICK IMAGE
  async pickImage(): Promise<string | null> {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        throw new Error('Se requiere permiso para acceder a las imágenes');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }

  // UPLOAD IMAGE
  private async uploadImage(imageUri: string): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const fileName = `plan_${Date.now()}.jpg`;
      const filePath = `planes/${fileName}`;

      const { data, error } = await supabase.storage
        .from('planes-imagenes')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('planes-imagenes')
        .getPublicUrl(filePath);

      return { success: true, url: urlData.publicUrl };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  // SUBSCRIBE TO CHANGES
  subscribeToPlanes(callback: (payload: any) => void): RealtimeChannel {
    const channel = supabase
      .channel('planes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'planes_moviles',
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }
}