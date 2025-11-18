import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { NotificationsService } from './src/data/services/NotificationsService';

export default function App() {
  useEffect(() => {
    const notificationService = NotificationsService.getInstance();
    notificationService.registerForPushNotifications();

    const receivedSubscription = notificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseSubscription = notificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
      }
    );

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <RootNavigator />
    </>
  );
}