// src/presentation/screens/asesor/EditPlanScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { styles } from '../../styles/EditPlanStyles';

type Props = AsesorStackScreenProps<'EditPlan'>;

const EditPlanScreen: React.FC<Props> = ({ navigation, route }) => {
  const { planId } = route.params;
  const { selectedPlan, fetchPlanById, updatePlan, pickImage } = usePlanesStore();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: 0,
    datosGb: '',
    minutos: '',
    sms: '',
    velocidad4g: '',
    velocidad5g: '',
    redesSociales: '',
    whatsapp: '',
    llamadasInternacionales: '',
    roaming: '',
    segmento: '',
    publicoObjetivo: '',
    imagenUrl: null as string | null,
  });

  useEffect(() => {
    fetchPlanById(planId);
  }, [planId]);

  useEffect(() => {
    if (selectedPlan) {
      setFormData({
        nombre: selectedPlan.nombre,
        precio: selectedPlan.precio,
        datosGb: selectedPlan.datosGb,
        minutos: selectedPlan.minutos,
        sms: selectedPlan.sms,
        velocidad4g: selectedPlan.velocidad4g,
        velocidad5g: selectedPlan.velocidad5g || '',
        redesSociales: selectedPlan.redesSociales,
        whatsapp: selectedPlan.whatsapp,
        llamadasInternacionales: selectedPlan.llamadasInternacionales,
        roaming: selectedPlan.roaming,
        segmento: selectedPlan.segmento,
        publicoObjetivo: selectedPlan.publicoObjetivo,
        imagenUrl: selectedPlan.imagenUrl,
      });
    }
  }, [selectedPlan]);

  const handleSelectImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) setImageUri(uri);
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.precio) {
      Alert.alert('Error', 'Completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    const result = await updatePlan(planId, formData, imageUri);
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Plan actualizado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (!selectedPlan) return <LoadingSpinner />;

  const displayImage = imageUri || formData.imagenUrl;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Editar Plan 📝</Text>
        </View>

        {/* Image Picker */}
        <TouchableOpacity onPress={handleSelectImage} style={styles.imagePicker}>
          {displayImage ? (
            <Image
              source={{ uri: displayImage }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.imagePickerText}>📷 Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>

        {/* Inputs */}
        <Input label="Nombre *" value={formData.nombre} onChangeText={(text) => setFormData({ ...formData, nombre: text })} />
        <Input label="Precio *" value={String(formData.precio)} onChangeText={(text) => setFormData({ ...formData, precio: parseFloat(text) || 0 })} keyboardType="numeric" />
        <Input label="Datos GB *" value={formData.datosGb} onChangeText={(text) => setFormData({ ...formData, datosGb: text })} />
        <Input label="Minutos *" value={formData.minutos} onChangeText={(text) => setFormData({ ...formData, minutos: text })} />
        <Input label="SMS *" value={formData.sms} onChangeText={(text) => setFormData({ ...formData, sms: text })} />
        <Input label="Velocidad 4G *" value={formData.velocidad4g} onChangeText={(text) => setFormData({ ...formData, velocidad4g: text })} />
        <Input label="Velocidad 5G" value={formData.velocidad5g} onChangeText={(text) => setFormData({ ...formData, velocidad5g: text })} />
        <Input label="Redes Sociales *" value={formData.redesSociales} onChangeText={(text) => setFormData({ ...formData, redesSociales: text })} />
        <Input label="WhatsApp *" value={formData.whatsapp} onChangeText={(text) => setFormData({ ...formData, whatsapp: text })} />
        <Input label="Llamadas Internacionales *" value={formData.llamadasInternacionales} onChangeText={(text) => setFormData({ ...formData, llamadasInternacionales: text })} />
        <Input label="Roaming *" value={formData.roaming} onChangeText={(text) => setFormData({ ...formData, roaming: text })} />
        <Input label="Segmento *" value={formData.segmento} onChangeText={(text) => setFormData({ ...formData, segmento: text })} />
        <Input label="Público Objetivo *" value={formData.publicoObjetivo} onChangeText={(text) => setFormData({ ...formData, publicoObjetivo: text })} />

        <Button title="Actualizar Plan" onPress={handleSubmit} loading={loading} disabled={loading} size="large" fullWidth />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPlanScreen;
