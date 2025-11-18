import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorTabScreenProps } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, fontSize } from '../../styles/spacing';

type Props = AsesorTabScreenProps<'Perfil'>;

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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mi Perfil 👤</Text>
        <Text style={styles.subtitle}>Asesor Comercial</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile.nombreMostrar[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.userName}>{profile.nombreMostrar}</Text>
            <Text style={styles.userEmail}>{profile.email}</Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={styles.option}>
              <Text style={styles.optionText}>✏️ Editar Perfil</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')} style={styles.option}>
              <Text style={styles.optionText}>🔒 Cambiar Contraseña</Text>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button title="Cerrar Sesión" onPress={handleLogout} variant="danger" fullWidth />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.gray[600],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  profileCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius['xl'],
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: colors.primary[600],
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 40,
    color: colors.white,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  userEmail: {
    color: colors.gray[600],
  },
  optionsContainer: {
    gap: spacing.md,
  },
  option: {
    backgroundColor: colors.gray[50],
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
  },
  optionArrow: {
    color: colors.gray[400],
  },
});

export default PerfilScreen;