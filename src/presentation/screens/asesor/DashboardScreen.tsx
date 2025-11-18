import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorTabScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { PlanCard } from '../../components/PlanCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/FilterModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, fontSize } from '../../styles/spacing';

type Props = AsesorTabScreenProps<'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { planes, isLoading, searchQuery, fetchPlanes, searchPlanes, filterByPrice, clearFilters, deletePlan, subscribeToPlanes, unsubscribeFromPlanes } = usePlanesStore();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPlanes();
    subscribeToPlanes();
    return () => unsubscribeFromPlanes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlanes();
    setRefreshing(false);
  };

  const handleDelete = (planId: string, planName: string) => {
    Alert.alert('Eliminar Plan', `¿Eliminar "${planName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const result = await deletePlan(planId);
          if (result.success) {
            Alert.alert('Eliminado', 'Plan eliminado correctamente.');
          }
        },
      },
    ]);
  };

  if (isLoading && planes.length === 0) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard 📊</Text>
          <Text style={styles.subtitle}>Gestiona tus planes</Text>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={searchPlanes}
            placeholder="Buscar planes..."
            showFilter
            onFilter={() => setShowFilterModal(true)}
          />
        </View>

        <View style={styles.planesContainer}>
          {planes.length === 0 ? (
            <EmptyState
              icon="📱"
              title="No hay planes"
              message="Crea tu primer plan móvil."
              actionLabel="Crear Plan"
              onAction={() => navigation.navigate('CreatePlan')}
            />
          ) : (
            planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPress={() => navigation.navigate('PlanDetail', { planId: plan.id })}
                showActions
                onEdit={() => navigation.navigate('EditPlan', { planId: plan.id })}
                onDelete={() => handleDelete(plan.id, plan.nombre)}
              />
            ))
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('CreatePlan')}
        style={styles.fab}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={filterByPrice}
        onClear={clearFilters}
      />
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.gray[600],
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  planesContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.primary[600],
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    color: colors.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;