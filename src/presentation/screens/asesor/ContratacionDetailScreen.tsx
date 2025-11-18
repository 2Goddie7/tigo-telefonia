// src/presentation/screens/asesor/ContratacionDetailScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { useContratacionesStore } from '../../store/contratacionesStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { styles } from '../../styles/ContratacionDetailStyles';

type Props = AsesorStackScreenProps<'ContratacionDetail'>;

const ContratacionDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { contratacionId } = route.params;
  const { selectedContratacion, fetchContratacionById, updateContratacion } = useContratacionesStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchContratacionById(contratacionId);
  }, [contratacionId]);

  const handleApprove = async () => {
    if (!user || !selectedContratacion) return;

    Alert.alert(
      'Aprobar Contratación',
      '¿Confirmar aprobación de esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aprobar',
          onPress: async () => {
            const result = await updateContratacion(contratacionId, user.id, { estado: 'aprobada' });
            if (result.success) {
              Alert.alert('Aprobada', 'Contratación aprobada correctamente.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!user || !selectedContratacion) return;

    Alert.alert(
      'Rechazar Contratación',
      '¿Confirmar rechazo de esta solicitud?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Rechazar',
          style: 'destructive',
          onPress: async () => {
            const result = await updateContratacion(contratacionId, user.id, { estado: 'rechazada' });
            if (result.success) {
              Alert.alert('Rechazada', 'Contratación rechazada.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }
          },
        },
      ]
    );
  };

  if (!selectedContratacion) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Detalle de Contratación</Text>
        </View>

        {/* Estado */}
        <View
          style={[
            styles.estadoContainer,
            { backgroundColor: `${selectedContratacion.estadoColor}20` },
          ]}
        >
          <Text
            style={[
              styles.estadoText,
              { color: selectedContratacion.estadoColor },
            ]}
          >
            {selectedContratacion.estadoIcono} {selectedContratacion.estadoTexto}
          </Text>
        </View>

        {/* Cliente */}
        {selectedContratacion.usuario && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Cliente:</Text>

            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {selectedContratacion.usuario.nombreMostrar[0].toUpperCase()}
                </Text>
              </View>

              <View>
                <Text style={styles.userName}>
                  {selectedContratacion.usuario.nombreMostrar}
                </Text>
                <Text style={styles.subText}>{selectedContratacion.usuario.email}</Text>

                {selectedContratacion.usuario.telefono && (
                  <Text style={styles.subText}>{selectedContratacion.usuario.telefono}</Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Plan */}
        {selectedContratacion.plan && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Plan Contratado:</Text>

            <Text style={styles.planTitle}>{selectedContratacion.plan.nombre}</Text>
            <Text style={styles.planPrice}>
              {selectedContratacion.plan.precioFormateado}/mes
            </Text>

            <View style={styles.planFeatures}>
              <Text style={styles.subText}>📊 {selectedContratacion.plan.datosGb}</Text>
              <Text style={styles.subText}>📞 {selectedContratacion.plan.minutos}</Text>
            </View>
          </View>
        )}

        {/* Fechas */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Fechas:</Text>

          <Text style={styles.subText}>
            Solicitado:{' '}
            {format(selectedContratacion.fechaContratacion, "d 'de' MMMM, yyyy", { locale: es })}
          </Text>

          {selectedContratacion.fechaAprobacion && (
            <Text style={styles.subText}>
              {selectedContratacion.estaAprobada ? 'Aprobado' : 'Rechazado'}:{' '}
              {format(selectedContratacion.fechaAprobacion, "d 'de' MMMM, yyyy", { locale: es })}
            </Text>
          )}
        </View>

        {/* Notas */}
        {selectedContratacion.notas && (
          <View style={styles.notesContainer}>
            <Text style={styles.cardLabel}>Notas:</Text>
            <Text style={styles.subText}>{selectedContratacion.notas}</Text>
          </View>
        )}

        {/* Acciones */}
        {selectedContratacion.estaPendiente ? (
          <View style={styles.actions}>
            <Button title="✅ Aprobar Contratación" onPress={handleApprove} variant="primary" fullWidth />
            <Button title="❌ Rechazar Contratación" onPress={handleReject} variant="danger" fullWidth />
          </View>
        ) : (
          <Button
            title="💬 Ir al Chat"
            onPress={() => navigation.navigate('Chat', { contratacionId })}
            variant="primary"
            fullWidth
          />
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContratacionDetailScreen;
