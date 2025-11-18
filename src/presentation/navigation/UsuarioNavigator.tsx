import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UsuarioStackParamList, UsuarioTabParamList } from './types';
import { Text } from 'react-native';

// Screens
import HomeScreen from '../screens/usuario/HomeScreen';
import MisContratacionesScreen from '../screens/usuario/MisContratacionesScreen';
import PerfilScreen from '../screens/usuario/PerfilScreen';
import PlanDetailScreen from '../screens/usuario/PlanDetailScreen';
import ChatScreen from '../screens/usuario/ChatScreen';
import EditProfileScreen from '../screens/usuario/EditProfileScreen';
import ResetPasswordScreen from '../screens/usuario/ResetPasswordScreen';

const Tab = createBottomTabNavigator<UsuarioTabParamList>();
const Stack = createNativeStackNavigator<UsuarioStackParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0057e6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Planes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📱</Text>,
        }}
      />
      <Tab.Screen
        name="MisContrataciones"
        component={MisContratacionesScreen}
        options={{
          tabBarLabel: 'Mis Planes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const UsuarioNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};