import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  static async getExpoPushToken(): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with your actual project ID
      });

      console.log('Expo Push Token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error getting push token:', error);
      return null;
    }
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    seconds: number = 0
  ): Promise<string | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: seconds > 0 ? { seconds } : null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  // Notification event listeners
  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  // Utility methods for common notifications
  static async notifyOrderStatus(orderId: string, status: string): Promise<void> {
    const statusMessages: { [key: string]: string } = {
      confirmed: 'Tu pedido ha sido confirmado',
      preparing: 'Tu pedido está siendo preparado',
      ready: 'Tu pedido está listo para recoger',
      delivered: 'Tu pedido ha sido entregado',
    };

    const message = statusMessages[status] || 'Estado de pedido actualizado';
    
    await this.scheduleLocalNotification(
      'TastyFood - Actualización de Pedido',
      `${message} (Pedido #${orderId})`
    );
  }

  static async notifyPromotion(title: string, description: string): Promise<void> {
    await this.scheduleLocalNotification(
      `TastyFood - ${title}`,
      description
    );
  }

  static async notifyWelcome(userName: string): Promise<void> {
    await this.scheduleLocalNotification(
      '¡Bienvenido a TastyFood!',
      `Hola ${userName}, gracias por unirte a nuestra comunidad. ¡Disfruta de la mejor comida!`
    );
  }
}