import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UsuarioStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type Props = UsuarioStackScreenProps<'PlanDetail'>;

const PlanDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { planId } = route.params;
  const { selectedPlan, fetchPlanById } = usePlanesStore();
  const { createContratacion } = useContratacionesStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPlanById(planId);
  }, [planId]);

  const handleContratar = async () => {
    if (!isAuthenticated || !user) {
      Alert.alert('Inicia Sesión', 'Debes iniciar sesión para contratar un plan.');
      return;
    }

    setIsLoading(true);
    const result = await createContratacion(user.id, { planId });
    setIsLoading(false);

    if (result.success) {
      Alert.alert('¡Solicitud Enviada! ✅', 'Tu solicitud está pendiente de aprobación.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'No se pudo procesar la solicitud.');
    }
  };

  if (!selectedPlan) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}
    >
      <ScrollView>
        <View
          style={{
            paddingHorizontal: 24, 
            paddingTop: 16,      
            paddingBottom: 8,     
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 24 }}>←</Text> {/* text-2xl */}
          </TouchableOpacity>
        </View>

        {selectedPlan.imagenUrl && (
          <Image
            source={{ uri: selectedPlan.imagenUrl }}
            style={{
              width: '100%',
              height: 192,
            }}
            resizeMode="cover"
          />

        )}

        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 24,
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: '#111827', // gray-900
              marginBottom: 8,
            }}
          >
            {selectedPlan.nombre}
          </Text>

          <Text
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: '#2563EB', // primary-600 (Aprox Tailwind blue-600)
              marginBottom: 16,
            }}
          >
            {selectedPlan.precioFormateado}/mes
          </Text>

          <View
            style={{
              backgroundColor: '#F9FAFB', // gray-50
              padding: 16,
              borderRadius: 12,
              marginBottom: 24,
            }}
          >

            <DetailRow icon="📊" label="Datos" value={selectedPlan.datosGb} />
            <DetailRow icon="📞" label="Minutos" value={selectedPlan.minutos} />
            <DetailRow icon="💬" label="SMS" value={selectedPlan.sms} />
            <DetailRow icon="📡" label="4G" value={selectedPlan.velocidad4g} />
            {selectedPlan.velocidad5g && <DetailRow icon="🚀" label="5G" value={selectedPlan.velocidad5g} />}
            <DetailRow icon="📱" label="Redes Sociales" value={selectedPlan.redesSociales} />
            <DetailRow icon="💚" label="WhatsApp" value={selectedPlan.whatsapp} />
            <DetailRow icon="🌍" label="Llamadas Int." value={selectedPlan.llamadasInternacionales} />
            <DetailRow icon="✈️" label="Roaming" value={selectedPlan.roaming} />
          </View>

          {isAuthenticated && (
            <Button
              title="Contratar Plan"
              onPress={handleContratar}
              loading={isLoading}
              disabled={isLoading}
              size="large"
              fullWidth
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB', // gray-200
    }}
  >
    <Text style={{ fontSize: 24, marginRight: 12 }}>{icon}</Text>

    <Text style={{ color: '#4B5563', flex: 1 }}>{label}</Text>

    <Text
      style={{
        color: '#111827',
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
      }}
    >
      {value}
    </Text>
  </View>

);

export default PlanDetailScreen;