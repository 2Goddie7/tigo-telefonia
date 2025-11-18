import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlanMovil } from '@domain/entities';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSize } from '../styles/spacing';

interface PlanCardProps {
  plan: PlanMovil;
  onPress: () => void;
  showActions?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onPress,
  showActions = false,
  onEdit,
  onDelete,
}) => {
  const getGradientColors = (): [string, string] => {
    if (plan.esBasico) {
      return ['#4caf50', '#2e7d32'];
    } else if (plan.esPremium) {
      return ['#ff6f00', '#e65100'];
    }
    return ['#2196f3', '#1565c0'];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.planName}>{plan.nombre}</Text>
            <Text style={styles.planSegment}>{plan.segmento}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{plan.precioFormateado}</Text>
            <Text style={styles.priceLabel}>/mes</Text>
          </View>
        </View>

        {plan.imagenUrl && (
          <Image
            source={{ uri: plan.imagenUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.features}>
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>{plan.datosGb}</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📞</Text>
            <Text style={styles.featureText}>{plan.minutos}</Text>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>💬</Text>
            <Text style={styles.featureText}>SMS: {plan.sms}</Text>
          </View>
        </View>

        {showActions && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={onEdit} style={styles.actionButtonEdit}>
              <Text style={styles.actionButtonText}>✏️ Editar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onDelete} style={styles.actionButtonDelete}>
              <Text style={styles.actionButtonText}>🗑️ Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  gradient: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  planName: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  planSegment: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fontSize.sm,
  },
  priceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.xl,
  },
  price: {
    color: colors.white,
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
  },
  priceLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 128,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.md,
  },
  features: {
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    color: colors.white,
    fontSize: 24,
    marginRight: spacing.sm,
  },
  featureText: {
    color: colors.white,
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  actionButtonEdit: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  actionButtonDelete: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  actionButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});