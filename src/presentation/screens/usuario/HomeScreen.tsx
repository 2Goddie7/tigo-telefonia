import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioTabScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { useAuthStore } from '../../store/authStore';
import { PlanCard } from '../../components/PlanCard';
import { SearchBar } from '../../components/SearchBar';
import { FilterModal } from '../../components/FilterModal';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors } from '../../styles/colors';
import { spacing, fontSize } from '../../styles/spacing';

type Props = UsuarioTabScreenProps<'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { planes, isLoading, searchQuery, fetchPlanes, searchPlanes, filterByPrice, clearFilters, subscribeToPlanes, unsubscribeFromPlanes } = usePlanesStore();
  const { profile } = useAuthStore();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPlanes();
    const channel = subscribeToPlanes();
    
    return () => {
      unsubscribeFromPlanes();
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlanes();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    searchPlanes(query);
  };

  const handleFilter = (min: number, max: number) => {
    filterByPrice(min, max);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  if (isLoading && planes.length === 0) {
    return <LoadingSpinner message="Cargando planes..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Planes Tigo 📱</Text>
          <Text style={styles.subtitle}>
            {profile ? `Hola, ${profile.nombreMostrar}` : 'Explora nuestros planes'}
          </Text>
        </View>

        {/* Search y Filter */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Buscar planes..."
            showFilter
            onFilter={() => setShowFilterModal(true)}
          />
        </View>

        {/* Planes */}
        <View style={styles.planesContainer}>
          {planes.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No hay planes"
              message="No se encontraron planes con los filtros aplicados."
              actionLabel="Limpiar Filtros"
              onAction={handleClearFilters}
            />
          ) : (
            planes.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onPress={() => navigation.navigate('PlanDetail', { planId: plan.id })}
              />
            ))
          )}
        </View>
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilter}
        onClear={handleClearFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
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
    marginBottom: spacing.xs,
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
});

export default HomeScreen;