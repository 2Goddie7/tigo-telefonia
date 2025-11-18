import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorTabScreenProps } from '../../navigation/types';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { ContratacionCard } from '../../components/ContratacionCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { colors } from '../../styles/colors';
import { spacing, fontSize } from '../../styles/spacing';

type Props = AsesorTabScreenProps<'Contrataciones'>;

const ContratacionesScreen: React.FC<Props> = ({ navigation }) => {
  const { contratacionesPendientes, isLoading, fetchContratacionesPendientes, updateContratacion, subscribeToContrataciones, unsubscribeFromContrataciones } = useContratacionesStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchContratacionesPendientes();
    subscribeToContrataciones();
    return () => unsubscribeFromContrataciones();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContratacionesPendientes();
    setRefreshing(false);
  };

  const handleApprove = async (id: string, planName: string) => {
    if (!user) return;
    Alert.alert('Aprobar', `¿Aprobar contratación de "${planName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Aprobar',
        onPress: async () => {
          const result = await updateContratacion(id, user.id, { estado: 'aprobada' });
          if (result.success) {
            Alert.alert('Aprobada', 'Contratación aprobada correctamente.');
          }
        },
      },
    ]);
  };

  const handleReject = async (id: string, planName: string) => {
    if (!user) return;
    Alert.alert('Rechazar', `¿Rechazar contratación de "${planName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Rechazar',
        style: 'destructive',
        onPress: async () => {
          const result = await updateContratacion(id, user.id, { estado: 'rechazada' });
          if (result.success) {
            Alert.alert('Rechazada', 'Contratación rechazada.');
          }
        },
      },
    ]);
  };

  if (isLoading && contratacionesPendientes.length === 0) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitudes 📋</Text>
        <Text style={styles.subtitle}>{contratacionesPendientes.length} pendientes</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {contratacionesPendientes.length === 0 ? (
          <EmptyState icon="✅" title="Todo al día" message="No hay solicitudes pendientes." />
        ) : (
          contratacionesPendientes.map((contratacion) => (
            <ContratacionCard
              key={contratacion.id}
              contratacion={contratacion}
              onPress={() => navigation.navigate('ContratacionDetail', { contratacionId: contratacion.id })}
              showUser
              showActions
              onApprove={() => handleApprove(contratacion.id, contratacion.plan?.nombre || 'Plan')}
              onReject={() => handleReject(contratacion.id, contratacion.plan?.nombre || 'Plan')}
            />
          ))
        )}
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
    paddingTop: spacing.lg,
  },
});

export default ContratacionesScreen;