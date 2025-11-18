import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AsesorStackParamList, AsesorTabParamList } from './types';
import { Text } from 'react-native';

// Screens
import DashboardScreen from '../screens/asesor/DashboardScreen';
import ContratacionesScreen from '../screens/asesor/ContratacionesScreen';
import ChatsScreen from '../screens/asesor/ChatsScreen';
import PerfilScreen from '../screens/asesor/PerfilScreen';
import CreatePlanScreen from '../screens/asesor/CreatePlanScreen';
import EditPlanScreen from '../screens/asesor/EditPlan';
import PlanDetailScreen from '../screens/asesor/PlanDetailScreen';
import ContratacionDetailScreen from '../screens/asesor/ContratacionDetailScreen';
import EditProfileScreen from '../screens/asesor/EditProfileScreen';
import ResetPasswordScreen from '../screens/asesor/ResetPasswordScreen';

const Tab = createBottomTabNavigator<AsesorTabParamList>();
const Stack = createNativeStackNavigator<AsesorStackParamList>();

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
        name="Dashboard"
        component={DashboardScreen as React.ComponentType<any>} // changed: cast to any
        options={{
          tabBarLabel: 'Planes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📱</Text>,
        }}
      />
      <Tab.Screen
        name="Contrataciones"
        component={ContratacionesScreen as React.ComponentType<any>} // changed: cast to any
        options={{
          tabBarLabel: 'Solicitudes',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>📋</Text>,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen as React.ComponentType<any>} // changed: cast to any
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen as React.ComponentType<any>} // changed: cast to any
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

export const AsesorNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator as React.ComponentType<any>} />
      <Stack.Screen name="CreatePlan" component={CreatePlanScreen as React.ComponentType<any>} />
      <Stack.Screen name="EditPlan" component={EditPlanScreen as React.ComponentType<any>} />
      <Stack.Screen name="PlanDetail" component={PlanDetailScreen as React.ComponentType<any>} />
      <Stack.Screen name="ContratacionDetail" component={ContratacionDetailScreen as React.ComponentType<any>} />
      <Stack.Screen name="Chat" component={ChatsScreen as React.ComponentType<any>} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen as React.ComponentType<any>} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen as React.ComponentType<any>} />
    </Stack.Navigator>
  );
};