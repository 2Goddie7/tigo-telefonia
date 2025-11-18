import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioTabScreenProps } from '../../navigation/types';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { ContratacionCard } from '../../components/ContratacionCard';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = UsuarioTabScreenProps<'MisContrataciones'>;

const MisContratacionesScreen: React.FC<Props> = ({ navigation }) => {
  const { contrataciones, isLoading, fetchUserContrataciones, subscribeToUserContrataciones, unsubscribeFromContrataciones } = useContratacionesStore();
  const { user } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    if (user) {
      fetchUserContrataciones(user.id);
      subscribeToUserContrataciones(user.id);
    }
    return () => unsubscribeFromContrataciones();
  }, [user]);

  const onRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    await fetchUserContrataciones(user.id);
    setRefreshing(false);
  };

  if (isLoading && contrataciones.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F9FAFB',
      }}
    >

      <View
        style={{
          paddingHorizontal: 24,   // px-6
          paddingTop: 24,          // pt-6
          paddingBottom: 16,       // pb-4
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#F3F4F6', // gray-100
        }}
      >
        <Text
          style={{
            fontSize: 30,       
            fontWeight: 'bold',    
            color: '#111827',     
          }}
        >
          Mis Planes 📋
        </Text>
      </View>


      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: 24,
          paddingTop: 16,    
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

      {contrataciones.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No hay contrataciones"
          message="Aún no has contratado ningún plan."
          actionLabel="Ver Planes"
          onAction={() => navigation.navigate('Home')}
        />
      ) : (
        contrataciones.map((contratacion) => (
          <ContratacionCard
            key={contratacion.id}
            contratacion={contratacion}
            onPress={() => !contratacion.estaPendiente && navigation.navigate('Chat', { contratacionId: contratacion.id })}
          />
        ))
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

export default MisContratacionesScreen;