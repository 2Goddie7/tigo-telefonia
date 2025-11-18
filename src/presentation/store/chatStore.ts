import { create } from 'zustand';
import { MensajeChat, SendMessageDTO } from '../../domain/entities';
import { ChatRepository } from '../../data/repositories/ChatRepository';
import { NotificationsService } from '../../data/services/NotificationsService';
import { RealtimeChannel } from '@supabase/supabase-js';

interface ChatState {
  // Estado
  messages: Record<string, MensajeChat[]>; // Key: contratacionId
  isLoading: boolean;
  isTyping: Record<string, boolean>; // Key: contratacionId
  unreadCounts: Record<string, number>; // Key: contratacionId
  realtimeChannels: Record<string, RealtimeChannel>; // Key: contratacionId

  // Acciones
  setMessages: (contratacionId: string, messages: MensajeChat[]) => void;
  addMessage: (contratacionId: string, message: MensajeChat) => void;
  setLoading: (loading: boolean) => void;
  setTyping: (contratacionId: string, isTyping: boolean) => void;
  setUnreadCount: (contratacionId: string, count: number) => void;

  // Métodos
  fetchMessages: (contratacionId: string) => Promise<void>;
  sendMessage: (userId: string, dto: SendMessageDTO, senderName: string) => Promise<{ success: boolean; error?: string }>;
  markAsRead: (contratacionId: string, userId: string) => Promise<void>;
  getUnreadCount: (contratacionId: string, userId: string) => Promise<number>;
  getTotalUnreadCount: (userId: string) => Promise<number>;

  // Indicador "escribiendo..."
  updateTypingStatus: (contratacionId: string, userId: string, isTyping: boolean) => Promise<void>;
  clearTypingStatus: (contratacionId: string, userId: string) => Promise<void>;

  // Realtime
  subscribeToMessages: (contratacionId: string, userId: string, currentUserName: string) => void;
  unsubscribeFromMessages: (contratacionId: string) => void;
  unsubscribeAll: () => void;
}

const chatRepository = new ChatRepository();
const notificationsService = NotificationsService.getInstance();

export const useChatStore = create<ChatState>((set, get) => ({
  // Estado inicial
  messages: {},
  isLoading: false,
  isTyping: {},
  unreadCounts: {},
  realtimeChannels: {},

  // Setters
  setMessages: (contratacionId, messages) => 
    set((state) => ({
      messages: { ...state.messages, [contratacionId]: messages },
    })),

  addMessage: (contratacionId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [contratacionId]: [...(state.messages[contratacionId] || []), message],
      },
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  setTyping: (contratacionId, isTyping) =>
    set((state) => ({
      isTyping: { ...state.isTyping, [contratacionId]: isTyping },
    })),

  setUnreadCount: (contratacionId, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [contratacionId]: count },
    })),

  // Obtener mensajes
  fetchMessages: async (contratacionId) => {
    try {
      set({ isLoading: true });
      const messages = await chatRepository.getMessages(contratacionId);
      get().setMessages(contratacionId, messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Enviar mensaje
  sendMessage: async (userId, dto, senderName) => {
    try {
      const result = await chatRepository.sendMessage(userId, dto);
      
      if (result.success && result.mensaje) {
        // El mensaje se añadirá automáticamente por Realtime
        // Limpiar estado de escritura
        await get().clearTypingStatus(dto.contratacionId, userId);
      }
      
      return result;
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },

  // Marcar mensajes como leídos
  markAsRead: async (contratacionId, userId) => {
    try {
      await chatRepository.markMessagesAsRead(contratacionId, userId);
      // Actualizar contador local
      get().setUnreadCount(contratacionId, 0);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  },

  // Obtener contador de no leídos
  getUnreadCount: async (contratacionId, userId) => {
    try {
      const count = await chatRepository.getUnreadCount(contratacionId, userId);
      get().setUnreadCount(contratacionId, count);
      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Obtener contador total de no leídos
  getTotalUnreadCount: async (userId) => {
    try {
      return await chatRepository.getTotalUnreadCount(userId);
    } catch (error) {
      console.error('Error getting total unread count:', error);
      return 0;
    }
  },

  // Actualizar estado de escritura
  updateTypingStatus: async (contratacionId, userId, isTyping) => {
    try {
      await chatRepository.updateTypingStatus(contratacionId, userId, isTyping);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  },

  // Limpiar estado de escritura
  clearTypingStatus: async (contratacionId, userId) => {
    try {
      await chatRepository.clearTypingStatus(contratacionId, userId);
    } catch (error) {
      console.error('Error clearing typing status:', error);
    }
  },

  // Suscribirse a mensajes y estado de escritura
  subscribeToMessages: (contratacionId, userId, currentUserName) => {
    // Suscribirse a mensajes
    const messagesChannel = chatRepository.subscribeToMessages(
      contratacionId,
      async (payload) => {
        console.log('Messages realtime event:', payload);
        
        if (payload.eventType === 'INSERT' && payload.new) {
          const newMessageData = payload.new;
          
          // Crear entidad de mensaje
          const newMessage = new MensajeChat(
            newMessageData.id,
            newMessageData.contratacion_id,
            newMessageData.remitente_id,
            newMessageData.mensaje,
            newMessageData.leido,
            new Date(newMessageData.created_at)
          );
          
          // Agregar mensaje al estado
          get().addMessage(contratacionId, newMessage);
          
          // Notificar si el mensaje es de otra persona
          if (newMessageData.remitente_id !== userId) {
            await notificationsService.notifyNewMessage(
              'Asesor',
              newMessageData.mensaje,
              contratacionId
            );
            
            // Actualizar contador de no leídos
            await get().getUnreadCount(contratacionId, userId);
          }
        }
      }
    );

    // Suscribirse a estado de escritura
    const typingChannel = chatRepository.subscribeToTypingStatus(
      contratacionId,
      (payload) => {
        console.log('Typing realtime event:', payload);
        
        if (payload.new && payload.new.usuario_id !== userId) {
          get().setTyping(contratacionId, payload.new.is_typing);
        }
      }
    );

    // Guardar canales
    set((state) => ({
      realtimeChannels: {
        ...state.realtimeChannels,
        [`${contratacionId}_messages`]: messagesChannel,
        [`${contratacionId}_typing`]: typingChannel,
      },
    }));
  },

  // Desuscribirse de mensajes
  unsubscribeFromMessages: (contratacionId) => {
    const { realtimeChannels } = get();
    
    const messagesChannel = realtimeChannels[`${contratacionId}_messages`];
    const typingChannel = realtimeChannels[`${contratacionId}_typing`];
    
    if (messagesChannel) {
      messagesChannel.unsubscribe();
    }
    
    if (typingChannel) {
      typingChannel.unsubscribe();
    }

    // Limpiar canales
    set((state) => {
      const newChannels = { ...state.realtimeChannels };
      delete newChannels[`${contratacionId}_messages`];
      delete newChannels[`${contratacionId}_typing`];
      return { realtimeChannels: newChannels };
    });
  },

  // Desuscribirse de todos los chats
  unsubscribeAll: () => {
    const { realtimeChannels } = get();
    
    Object.values(realtimeChannels).forEach((channel) => {
      channel.unsubscribe();
    });
    
    set({ realtimeChannels: {} });
  },
}));