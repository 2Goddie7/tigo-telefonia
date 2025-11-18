// src/presentation/screens/asesor/PlanDetailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { styles } from '../../styles/PlanDetailStyles'


type Props = AsesorStackScreenProps<'PlanDetail'>;

const PlanDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { planId } = route.params;
  const { selectedPlan, fetchPlanById, deletePlan } = usePlanesStore();

  useEffect(() => {
    fetchPlanById(planId);
  }, [planId]);

  const handleDelete = () => {
    if (!selectedPlan) return;

    Alert.alert(
      'Eliminar Plan',
      `¿Estás seguro de eliminar "${selectedPlan.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const result = await deletePlan(planId);
            if (result.success) {
              Alert.alert('Eliminado', 'Plan eliminado correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  if (!selectedPlan) return <LoadingSpinner />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>

        {/* Back */}
        <View style={styles.backContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Imagen */}
        {selectedPlan.imagenUrl && (
          <Image
            source={{ uri: selectedPlan.imagenUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        {/* Contenido */}
        <View style={styles.content}>

          {/* Título y precio */}
          <View style={styles.headerRow}>
            <View style={styles.headerInfo}>
              <Text style={styles.planName}>{selectedPlan.nombre}</Text>
              <Text style={styles.segmento}>{selectedPlan.segmento}</Text>
            </View>

            <Text style={styles.price}>{selectedPlan.precioFormateado}/mes</Text>
          </View>

          {/* Detalles */}
          <View style={styles.detailBox}>
            <DetailRow icon="📊" label="Datos" value={selectedPlan.datosGb} />
            <DetailRow icon="📞" label="Minutos" value={selectedPlan.minutos} />
            <DetailRow icon="💬" label="SMS" value={selectedPlan.sms} />
            <DetailRow icon="📡" label="4G" value={selectedPlan.velocidad4g} />

            {selectedPlan.velocidad5g ? (
              <DetailRow icon="🚀" label="5G" value={selectedPlan.velocidad5g} />
            ) : null}

            <DetailRow icon="📱" label="Redes Sociales" value={selectedPlan.redesSociales} />
            <DetailRow icon="💚" label="WhatsApp" value={selectedPlan.whatsapp} />
            <DetailRow icon="🌎" label="Llamadas Int." value={selectedPlan.llamadasInternacionales} />
            <DetailRow icon="✈️" label="Roaming" value={selectedPlan.roaming} />
          </View>

          {/* Público Objetivo */}
          <View style={styles.targetBox}>
            <Text style={styles.targetLabel}>Público Objetivo:</Text>
            <Text style={styles.targetText}>{selectedPlan.publicoObjetivo}</Text>
          </View>

          {/* Botones */}
          <View style={styles.buttonsContainer}>
            <Button
              title="✏️ Editar Plan"
              onPress={() => navigation.navigate('EditPlan', { planId })}
              variant="primary"
              fullWidth
            />
            <Button
              title="🗑️ Eliminar Plan"
              onPress={handleDelete}
              variant="danger"
              fullWidth
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default PlanDetailScreen;
