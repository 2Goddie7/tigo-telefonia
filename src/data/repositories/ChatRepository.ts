import { supabase } from '../../core/supabase/client';
import { MensajeChat, Perfil, SendMessageDTO, ChatTyping } from '../../domain/entities';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface MessageResponse {
  success: boolean;
  mensaje?: MensajeChat;
  error?: string;
}

export class ChatRepository {
  // Enviar mensaje
  async sendMessage(
    remitenteId: string,
    dto: SendMessageDTO
  ): Promise<MessageResponse> {
    try {
      const { data, error } = await supabase
        .from('mensajes_chat')
        .insert([{
          contratacion_id: dto.contratacionId,
          remitente_id: remitenteId,
          mensaje: dto.mensaje,
          leido: false,
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('No se pudo enviar el mensaje');

      return {
        success: true,
        mensaje: this._mapToMensajeChat(data),
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  // Obtener mensajes de una contratación
  async getMessages(contratacionId: string): Promise<MensajeChat[]> {
    try {
      const { data, error } = await supabase
        .from('mensajes_chat')
        .select(`
          *,
          remitente:perfiles(*)
        `)
        .eq('contratacion_id', contratacionId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(item => this._mapToMensajeChatWithRemitente(item));
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  // Marcar mensajes como leídos
  async markMessagesAsRead(
    contratacionId: string,
    usuarioId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('mensajes_chat')
        .update({ leido: true })
        .eq('contratacion_id', contratacionId)
        .neq('remitente_id', usuarioId)
        .eq('leido', false);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  // Obtener cantidad de mensajes no leídos de una contratación
  async getUnreadCount(
    contratacionId: string,
    usuarioId: string
  ): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('mensajes_chat')
        .select('*', { count: 'exact', head: true })
        .eq('contratacion_id', contratacionId)
        .neq('remitente_id', usuarioId)
        .eq('leido', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Obtener total de mensajes no leídos del usuario
  async getTotalUnreadCount(usuarioId: string): Promise<number> {
    try {
      // Obtener contrataciones del usuario
      const { data: contrataciones, error: contratacionesError } = await supabase
        .from('contrataciones')
        .select('id')
        .eq('usuario_id', usuarioId);

      if (contratacionesError) throw contratacionesError;

      if (!contrataciones || contrataciones.length === 0) return 0;

      const contratacionIds = contrataciones.map(c => c.id);

      const { count, error } = await supabase
        .from('mensajes_chat')
        .select('*', { count: 'exact', head: true })
        .in('contratacion_id', contratacionIds)
        .neq('remitente_id', usuarioId)
        .eq('leido', false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error('Error getting total unread count:', error);
      return 0;
    }
  }

  // Suscribirse a mensajes de una contratación
  subscribeToMessages(
    contratacionId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`messages_${contratacionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes_chat',
          filter: `contratacion_id=eq.${contratacionId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // ===== INDICADOR "ESCRIBIENDO..." =====

  // Actualizar estado de escritura
  async updateTypingStatus(
    contratacionId: string,
    usuarioId: string,
    isTyping: boolean
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('chat_typing')
        .upsert({
          contratacion_id: contratacionId,
          usuario_id: usuarioId,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'contratacion_id,usuario_id',
        });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  // Obtener estado de escritura
  async getTypingStatus(
    contratacionId: string,
    excludeUserId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('chat_typing')
        .select('is_typing')
        .eq('contratacion_id', contratacionId)
        .neq('usuario_id', excludeUserId)
        .eq('is_typing', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      return data?.is_typing || false;
    } catch (error) {
      console.error('Error getting typing status:', error);
      return false;
    }
  }

  // Suscribirse a estado de escritura
  subscribeToTypingStatus(
    contratacionId: string,
    callback: (payload: any) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel(`typing_${contratacionId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_typing',
          filter: `contratacion_id=eq.${contratacionId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return channel;
  }

  // Limpiar estado de escritura al salir del chat
  async clearTypingStatus(
    contratacionId: string,
    usuarioId: string
  ): Promise<void> {
    try {
      await this.updateTypingStatus(contratacionId, usuarioId, false);
    } catch (error) {
      console.error('Error clearing typing status:', error);
    }
  }

  // Mapear datos básicos a entidad
  private _mapToMensajeChat(data: any): MensajeChat {
    return new MensajeChat(
      data.id,
      data.contratacion_id,
      data.remitente_id,
      data.mensaje,
      data.leido,
      new Date(data.created_at)
    );
  }

  // Mapear datos con remitente a entidad
  private _mapToMensajeChatWithRemitente(data: any): MensajeChat {
    let remitente: Perfil | undefined;

    if (data.remitente) {
      remitente = new Perfil(
        data.remitente.id,
        data.remitente.email,
        data.remitente.nombre_completo,
        data.remitente.telefono,
        data.remitente.rol,
        data.remitente.avatar_url,
        new Date(data.remitente.created_at),
        new Date(data.remitente.updated_at)
      );
    }

    return new MensajeChat(
      data.id,
      data.contratacion_id,
      data.remitente_id,
      data.mensaje,
      data.leido,
      new Date(data.created_at),
      remitente
    );
  }
}