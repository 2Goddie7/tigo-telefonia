import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { colors } from '../../styles/colors';
import { spacing, fontSize } from '../../styles/spacing';

type Props = AuthStackScreenProps<'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuthStore();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setError('El email es requerido');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setError('');
    setIsLoading(true);
    const result = await resetPassword(email.trim().toLowerCase());
    setIsLoading(false);

    if (result.success) {
      Alert.alert(
        'Email Enviado ✅',
        'Revisa tu correo para restablecer tu contraseña.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Error', result.error || 'No se pudo enviar el email.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>¿Olvidaste tu contraseña? 🔒</Text>
          <Text style={styles.subtitle}>Te enviaremos un email para restablecerla</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
            icon={<Text style={styles.inputIcon}>📧</Text>}
          />

          <Button
            title="Enviar Email"
            onPress={handleResetPassword}
            loading={isLoading}
            disabled={isLoading}
            size="large"
            fullWidth
          />
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
});

export default ForgotPasswordScreen;