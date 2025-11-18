import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { styles } from '../../styles/ResetPasswordStyles';

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Cambiar Contraseña 🔒
          </Text>
        </View>

        <View style={styles.formContainer}>

          {/* Nueva contraseña */}
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
            icon={<Text style={styles.icon}>🔑</Text>}
            rightIcon={<Text style={styles.icon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          {/* Confirmación */}
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
            icon={<Text style={styles.icon}>🔑</Text>}
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
