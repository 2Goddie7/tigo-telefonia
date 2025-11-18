import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

type Props = UsuarioStackScreenProps<'ResetPassword'>;

const ResetPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { updatePassword } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await updatePassword(formData.newPassword);
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Contraseña actualizada correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ paddingTop: 16, paddingBottom: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: '#1F2937',
              marginTop: 16,
            }}
          >
            Cambiar Contraseña 🔒
          </Text>

        </View>

        <View style={{ paddingVertical: 24 }}>
          <Input
            label="Nueva Contraseña"
            value={formData.newPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, newPassword: text });
              setErrors({ ...errors, newPassword: '' });
            }}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.newPassword}
            icon={<Text style={{ fontSize: 24 }}>🔑</Text>}
            rightIcon={<Text style={{ fontSize: 24 }}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirmar Contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => {
              setFormData({ ...formData, confirmPassword: text });
              setErrors({ ...errors, confirmPassword: '' });
            }}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            icon={<Text style={{ fontSize: 20 }}>🔑</Text>}
          />

          <Button
            title="Actualizar Contraseña"
            onPress={handleSubmit}
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

export default ResetPasswordScreen;