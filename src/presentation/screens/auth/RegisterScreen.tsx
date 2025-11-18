import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../styles/colors';
import { spacing, fontSize } from '../../styles/spacing';

type Props = AuthStackScreenProps<'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nombreCompleto.trim()) {
      newErrors.nombreCompleto = 'El nombre es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signUp(email.trim().toLowerCase(), password, nombreCompleto.trim());
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        '¡Registro Exitoso! 🎉',
        'Tu cuenta ha sido creada correctamente.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'Error de Registro',
        result.error || 'No se pudo crear la cuenta. Intenta nuevamente.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Crear Cuenta 🚀</Text>
          <Text style={styles.subtitle}>Únete a Tigo Conecta hoy</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre Completo"
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
            placeholder="Juan Pérez"
            error={errors.nombreCompleto}
            icon={<Text style={styles.inputIcon}>👤</Text>}
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            icon={<Text style={styles.inputIcon}>📧</Text>}
          />

          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.password}
            icon={<Text style={styles.inputIcon}>🔒</Text>}
            rightIcon={<Text style={styles.inputIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />

          <Input
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            error={errors.confirmPassword}
            icon={<Text style={styles.inputIcon}>🔒</Text>}
          />

          <Button
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
            size="large"
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿Ya tienes cuenta?{' '}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={styles.footerLink}
            >
              Inicia Sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  header: {
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.xl,
  },
  backIcon: {
    fontSize: fontSize['2xl'],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.gray[600],
  },
  form: {
    paddingVertical: spacing.xl,
  },
  inputIcon: {
    fontSize: 20,
  },
  footer: {
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.gray[600],
    fontSize: fontSize.base,
  },
  footerLink: {
    color: colors.primary[600],
    fontWeight: '600',
  },
});

export default RegisterScreen;