import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, fontSize } from '../../styles/spacing';

type Props = AuthStackScreenProps<'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const result = await signIn(email.trim().toLowerCase(), password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert(
        'Error de Inicio de Sesión',
        result.error || 'No se pudo iniciar sesión. Verifica tus credenciales.'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Bienvenido 👋</Text>
          <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <Button
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            size="large"
            fullWidth
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            ¿No tienes cuenta?{' '}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={styles.footerLink}
            >
              Regístrate
            </Text>
          </Text>
        </View>

        {/* Demo Credentials */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>🎯 Credenciales de prueba:</Text>
          <Text style={styles.demoText}>Asesor: asesor@tigo.com.ec / Asesor123!</Text>
          <Text style={styles.demoText}>Usuario: Regístrate para crear uno</Text>
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
  forgotPassword: {
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    color: colors.primary[600],
    fontWeight: '600',
    textAlign: 'right',
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
  demoBox: {
    marginBottom: spacing.xxl,
    backgroundColor: colors.blue[50],
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  demoTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  demoText: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
  },
});

export default LoginScreen;