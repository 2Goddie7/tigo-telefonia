import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { usePlanesStore } from '../../store/planesStore';
import { colors } from '../../styles/colors';
import { spacing, fontSize } from '../../styles/spacing';

type Props = AuthStackScreenProps<'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const { fetchPlanes } = usePlanesStore();

  useEffect(() => {
    fetchPlanes();
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary[600], colors.primary[800]]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {/* Logo y Título */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>📱</Text>
            <Text style={styles.title}>Tigo Conecta</Text>
            <Text style={styles.subtitle}>Tu conexión perfecta empieza aquí</Text>
          </View>

          {/* Características */}
          <View style={styles.features}>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureText}>Planes móviles a tu medida</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>💬</Text>
              <Text style={styles.featureText}>Chat en tiempo real con asesores</Text>
            </View>
            <View style={styles.featureRow}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Gestión rápida y segura</Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.footer}>
          <Button
            title="Ver Planes"
            onPress={() => navigation.navigate('Login')}
            variant="secondary"
            size="large"
            fullWidth
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="Iniciar Sesión"
            onPress={() => navigation.navigate('Login')}
            variant="outline"
            size="large"
            fullWidth
          />
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>¿No tienes cuenta? </Text>
            <Text
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}
            >
              Regístrate aquí
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl * 2,
  },
  logoIcon: {
    fontSize: 70,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: fontSize['4xl'],
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
  features: {
    width: '100%',
    marginBottom: spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  featureIcon: {
    fontSize: 30,
    marginRight: spacing.md,
  },
  featureText: {
    color: colors.white,
    fontSize: fontSize.base,
    flex: 1,
  },
  footer: {
    paddingBottom: spacing.xxl,
  },
  buttonSpacing: {
    height: spacing.md,
  },
  registerContainer: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  registerLink: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize.sm,
  },
});

export default WelcomeScreen;