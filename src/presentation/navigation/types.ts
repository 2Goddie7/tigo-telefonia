import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

// Usuario Stack
export type UsuarioTabParamList = {
  Home: undefined;
  MisContrataciones: undefined;
  Perfil: undefined;
};

export type UsuarioStackParamList = {
  MainTabs: undefined;
  PlanDetail: { planId: string };
  Chat: { contratacionId: string };
  EditProfile: undefined;
  ResetPassword: undefined;
};

export type UsuarioTabScreenProps<T extends keyof UsuarioTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<UsuarioTabParamList, T>,
    NativeStackScreenProps<UsuarioStackParamList>
  >;

export type UsuarioStackScreenProps<T extends keyof UsuarioStackParamList> =
  NativeStackScreenProps<UsuarioStackParamList, T>;

// Asesor Stack
export type AsesorTabParamList = {
  Dashboard: undefined;
  Contrataciones: undefined;
  Chats: undefined;
  Perfil: undefined;
};

export type AsesorStackParamList = {
  MainTabs: undefined;
  CreatePlan: undefined;
  EditPlan: { planId: string };
  PlanDetail: { planId: string };
  ContratacionDetail: { contratacionId: string };
  Chat: { contratacionId: string };
  EditProfile: undefined;
  ResetPassword: undefined;
};

export type AsesorTabScreenProps<T extends keyof AsesorTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<AsesorTabParamList, T>,
    NativeStackScreenProps<AsesorStackParamList>
  >;

export type AsesorStackScreenProps<T extends keyof AsesorStackParamList> =
  NativeStackScreenProps<AsesorStackParamList, T>;

// Root Navigator
export type RootStackParamList = {
  Auth: undefined;
  UsuarioStack: undefined;
  AsesorStack: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}