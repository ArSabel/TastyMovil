import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './context/AuthContext';
import { AppNavigator } from './navigation/AppNavigator';
import { NotificationService } from './services/NotificationService';
import { Alert } from 'react-native';
import { SplashScreen } from './screens';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  const handleAnimationComplete = () => {
    setIsLoading(false);
  };
  
  useEffect(() => {
    // Initialize notifications
    const initializeNotifications = async () => {
      try {
        const hasPermission = await NotificationService.requestPermissions();
        if (hasPermission) {
          const token = await NotificationService.getExpoPushToken();
          console.log('Push token obtained:', token);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();

    // Set up notification listeners
    const notificationListener = NotificationService.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      }
    );

    const responseListener = NotificationService.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
      }
    );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      {isLoading ? (
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <AppNavigator />
      )}
    </AuthProvider>
  );
}
