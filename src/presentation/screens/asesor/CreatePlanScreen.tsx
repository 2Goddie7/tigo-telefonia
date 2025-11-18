import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AsesorStackScreenProps } from '../../navigation/types';
import { usePlanesStore } from '../../store/planesStore';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { CreatePlanDTO } from '@domain/entities';
import { colors } from '../../styles/colors';
import { spacing, borderRadius, fontSize } from '../../styles/spacing';

type Props = AsesorStackScreenProps<'CreatePlan'>;

const CreatePlanScreen: React.FC<Props> = ({ navigation }) => {
  const { createPlan, pickImage } = usePlanesStore();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePlanDTO>({
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
  });

  const handleSelectImage = async () => {
    try {
      const uri = await pickImage();
      if (uri) setImageUri(uri);
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.precio) {
      Alert.alert('Error', 'Completa todos los campos obligatorios.');
      return;
    }

    setLoading(true);
    const result = await createPlan(formData, imageUri);
    setLoading(false);

    if (result.success) {
      Alert.alert('Éxito', 'Plan creado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Crear Plan 📱</Text>
        </View>

        <TouchableOpacity onPress={handleSelectImage} style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <Text style={styles.imagePlaceholder}>📷 Seleccionar Imagen</Text>
          )}
        </TouchableOpacity>

        <Input label="Nombre *" value={formData.nombre} onChangeText={(text) => setFormData({ ...formData, nombre: text })} />
        <Input label="Precio *" value={String(formData.precio)} onChangeText={(text) => setFormData({ ...formData, precio: parseFloat(text) || 0 })} keyboardType="numeric" />
        <Input label="Datos GB *" value={formData.datosGb} onChangeText={(text) => setFormData({ ...formData, datosGb: text })} />
        <Input label="Minutos *" value={formData.minutos} onChangeText={(text) => setFormData({ ...formData, minutos: text })} />
        <Input label="SMS *" value={formData.sms} onChangeText={(text) => setFormData({ ...formData, sms: text })} />
        <Input label="Velocidad 4G *" value={formData.velocidad4g} onChangeText={(text) => setFormData({ ...formData, velocidad4g: text })} />
        <Input label="Velocidad 5G" value={formData.velocidad5g || ''} onChangeText={(text) => setFormData({ ...formData, velocidad5g: text })} />
        <Input label="Redes Sociales *" value={formData.redesSociales} onChangeText={(text) => setFormData({ ...formData, redesSociales: text })} />
        <Input label="WhatsApp *" value={formData.whatsapp} onChangeText={(text) => setFormData({ ...formData, whatsapp: text })} />
        <Input label="Llamadas Internacionales *" value={formData.llamadasInternacionales} onChangeText={(text) => setFormData({ ...formData, llamadasInternacionales: text })} />
        <Input label="Roaming *" value={formData.roaming} onChangeText={(text) => setFormData({ ...formData, roaming: text })} />
        <Input label="Segmento *" value={formData.segmento} onChangeText={(text) => setFormData({ ...formData, segmento: text })} />
        <Input label="Público Objetivo *" value={formData.publicoObjetivo} onChangeText={(text) => setFormData({ ...formData, publicoObjetivo: text })} />

        <Button title="Crear Plan" onPress={handleSubmit} loading={loading} disabled={loading} size="large" fullWidth />
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  headerContainer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backIcon: {
    fontSize: fontSize['2xl'],
  },
  title: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: spacing.lg,
  },
  imageContainer: {
    backgroundColor: colors.gray[100],
    height: 192,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.xl,
  },
  imagePlaceholder: {
    color: colors.gray[500],
    fontSize: fontSize.base,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default CreatePlanScreen;