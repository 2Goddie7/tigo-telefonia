import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSize } from '../styles/spacing';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (minPrice: number, maxPrice: number) => void;
  onClear: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  onClear,
}) => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);

  const priceRanges = [
    { label: 'Hasta $20', min: 0, max: 20 },
    { label: '$20 - $35', min: 20, max: 35 },
    { label: '$35 - $50', min: 35, max: 50 },
    { label: 'Más de $50', min: 50, max: 1000 },
  ];

  const handleApply = () => {
    if (selectedRange) {
      const range = priceRanges.find(r => r.label === selectedRange);
      if (range) {
        onApply(range.min, range.max);
        onClose();
      }
    }
  };

  const handleClear = () => {
    setSelectedRange(null);
    onClear();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filtrar por Precio</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.label}
                onPress={() => setSelectedRange(range.label)}
                style={[
                  styles.rangeButton,
                  selectedRange === range.label && styles.rangeButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.rangeText,
                    selectedRange === range.label && styles.rangeTextSelected,
                  ]}
                >
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Aplicar Filtro"
              onPress={handleApply}
              disabled={!selectedRange}
              fullWidth
            />
            <View style={styles.spacing} />
            <Button
              title="Limpiar Filtros"
              onPress={handleClear}
              variant="outline"
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  closeButton: {
    color: colors.gray[500],
    fontSize: fontSize['2xl'],
  },
  rangeButton: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  rangeButtonSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  rangeText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  rangeTextSelected: {
    color: colors.primary[600],
  },
  footer: {
    marginTop: spacing.xl,
  },
  spacing: {
    height: spacing.md,
  },
});