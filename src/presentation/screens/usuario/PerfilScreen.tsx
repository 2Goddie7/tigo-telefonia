import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioTabScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';

type Props = UsuarioTabScreenProps<'Perfil'>;

const PerfilScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', onPress: signOut, style: 'destructive' }
    ]);
  };

  if (!profile) return null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F9FAFB', // gray-50
      }}
    >
      <View
        style={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 16,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6', // gray-100
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#111827', // gray-900
          }}
        >
          Mi Perfil 👤
        </Text>
      </View>

      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 24,
        }}
      >
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            marginBottom: 16,
          }}
        >
          {/* Avatar + Nombre */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <View
              style={{
                width: 96, // w-24
                height: 96, // h-24
                backgroundColor: '#2563EB', // primary-600 approx
                borderRadius: 9999,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  fontSize: 36, // text-4xl
                  color: '#FFFFFF',
                }}
              >
                {profile.nombreMostrar[0].toUpperCase()}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#111827',
              }}
            >
              {profile.nombreMostrar}
            </Text>

            <Text
              style={{
                color: '#4B5563', // gray-600
              }}
            >
              {profile.email}
            </Text>
          </View>

          {/* Opciones */}
          <View style={{ gap: 12 }}>
            {/* Editar perfil */}
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={{
                backgroundColor: '#F9FAFB', // gray-50
                padding: 16,
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                ✏️ Editar Perfil
              </Text>
              <Text style={{ color: '#9CA3AF' }}>→</Text>
            </TouchableOpacity>

            {/* Cambiar contraseña */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ResetPassword')}
              style={{
                backgroundColor: '#F9FAFB',
                padding: 16,
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111827',
                }}
              >
                🔑 Cambiar Contraseña
              </Text>
              <Text style={{ color: '#9CA3AF' }}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Cerrar Sesión"
          onPress={handleLogout}
          variant="danger"
          fullWidth
        />
      </ScrollView>
    </SafeAreaView>

  );
};

export default PerfilScreen;