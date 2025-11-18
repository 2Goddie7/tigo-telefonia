import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { AuthNavigator } from './AuthNavigator';
import { UsuarioNavigator } from './UsuarioNavigator';
import { AsesorNavigator } from './AsesorNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, profile, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Iniciando aplicación..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : profile?.esAsesor ? (
          <Stack.Screen name="AsesorStack" component={AsesorNavigator} />
        ) : (
          <Stack.Screen name="UsuarioStack" component={UsuarioNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};