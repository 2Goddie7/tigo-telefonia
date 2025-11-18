import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationsService {
  private static instance: NotificationsService;
  private expoPushToken: string | null = null;

  private constructor() {}

  static getInstance(): NotificationsService {
    if (!NotificationsService.instance) {
      NotificationsService.instance = new NotificationsService();
    }
    return NotificationsService.instance;
  }

  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Las notificaciones push solo funcionan en dispositivos físicos');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('No se otorgaron permisos para notificaciones');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });

      this.expoPushToken = token.data;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#0057e6',
        });
      }

      return this.expoPushToken;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }


  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Enviar notificación local
  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<string> {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: true,
      },
      trigger: null, // Enviar inmediatamente
    });
  }

  async notifyNewMessage(
    senderName: string,
    message: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      `💬 Mensaje de ${senderName}`,
      message,
      {
        type: 'new_message',
        contratacionId,
      }
    );
  }

  // Notificación: Contratación aprobada
  async notifyContratacionApproved(
    planName: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '✅ Contratación Aprobada',
      `Tu solicitud para el plan "${planName}" ha sido aprobada.`,
      {
        type: 'contratacion_approved',
        contratacionId,
      }
    );
  }

  // Notificación: Contratación rechazada
  async notifyContratacionRejected(
    planName: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '❌ Contratación Rechazada',
      `Tu solicitud para el plan "${planName}" ha sido rechazada.`,
      {
        type: 'contratacion_rejected',
        contratacionId,
      }
    );
  }

  // Notificación: Nueva contratación pendiente (para asesores)
  async notifyNewContratacion(
    userName: string,
    planName: string,
    contratacionId: string
  ): Promise<void> {
    await this.scheduleLocalNotification(
      '🔔 Nueva Contratación',
      `${userName} ha solicitado el plan "${planName}".`,
      {
        type: 'new_contratacion',
        contratacionId,
      }
    );
  }

  // Notificación: Plan actualizado
  async notifyPlanUpdated(planName: string): Promise<void> {
    await this.scheduleLocalNotification(
      '🔄 Plan Actualizado',
      `El plan "${planName}" ha sido actualizado.`,
      {
        type: 'plan_updated',
      }
    );
  }

  // Listener para notificaciones recibidas (app en foreground)
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Listener para cuando el usuario toca una notificación
  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Limpiar badge (contador de notificaciones)
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // Cancelar todas las notificaciones programadas
  async cancelAllScheduledNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Obtener notificaciones presentadas
  async getPresentedNotifications(): Promise<Notifications.Notification[]> {
    return await Notifications.getPresentedNotificationsAsync();
  }

  // Limpiar notificaciones presentadas
  async dismissAllNotifications(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }
}