import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { StyleSheet } from 'react-native';

type Props = UsuarioStackScreenProps<'EditProfile'>;

const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { profile, updateProfile, refreshProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        nombreCompleto: profile.nombreCompleto || '',
        telefono: profile.telefono || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!formData.nombreCompleto.trim()) {
      Alert.alert('Error', 'El nombre es requerido');
      return;
    }

    setLoading(true);
    const result = await updateProfile({
      nombreCompleto: formData.nombreCompleto.trim(),
      telefono: formData.telefono.trim() || undefined,
    });
    setLoading(false);

    if (result.success) {
      await refreshProfile();
      Alert.alert('Éxito', 'Perfil actualizado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Editar Perfil ✏️</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="Nombre Completo *"
            value={formData.nombreCompleto}
            onChangeText={(text) =>
              setFormData({ ...formData, nombreCompleto: text })
            }
            placeholder="Juan Pérez"
            icon={<Text style={styles.inputIcon}>👤</Text>}
          />

          <Input
            label="Teléfono"
            value={formData.telefono}
            onChangeText={(text) =>
              setFormData({ ...formData, telefono: text })
            }
            placeholder="+593 99 123 4567"
            keyboardType="phone-pad"
            icon={<Text style={styles.inputIcon}>📱</Text>}
          />

          <Input
            label="Email"
            value={profile?.email || ''}
            editable={false}
            icon={<Text style={styles.inputIcon}>📧</Text>}
          />

          <Button
            title="Guardar Cambios"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            size="large"
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 24, // px-6
  },

  headerContainer: {
    paddingTop: 16,  // pt-4
    paddingBottom: 24, // pb-6
  },

  backIcon: {
    fontSize: 24, // text-2xl
  },

  title: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: '#111827', // gray-900
    marginTop: 16, // mt-4
  },

  formContainer: {
    paddingVertical: 24, // py-6
  },

  inputIcon: {
    fontSize: 20, // text-xl
  },
});

export default EditProfileScreen;