import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Contratacion } from '@domain/entities';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSize } from '../styles/spacing';

interface ContratacionCardProps {
  contratacion: Contratacion;
  onPress: () => void;
  showUser?: boolean;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export const ContratacionCard: React.FC<ContratacionCardProps> = ({
  contratacion,
  onPress,
  showUser = false,
  showActions = false,
  onApprove,
  onReject,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      {/* Header con estado */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.planName}>
            {contratacion.plan?.nombre || 'Plan'}
          </Text>
          {showUser && contratacion.usuario && (
            <Text style={styles.userName}>
              Cliente: {contratacion.usuario.nombreMostrar}
            </Text>
          )}
        </View>
        
        <View
          style={[
            styles.badge,
            { backgroundColor: `${contratacion.estadoColor}20` }
          ]}
        >
          <Text style={[styles.badgeText, { color: contratacion.estadoColor }]}>
            {contratacion.estadoIcono} {contratacion.estadoTexto}
          </Text>
        </View>
      </View>

      {/* Detalles del plan */}
      {contratacion.plan && (
        <View style={styles.planDetails}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Precio</Text>
            <Text style={styles.price}>
              {contratacion.plan.precioFormateado}/mes
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>
              {contratacion.plan.datosGb}
            </Text>
          </View>
          
          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>📞</Text>
            <Text style={styles.featureText}>
              {contratacion.plan.minutos}
            </Text>
          </View>
        </View>
      )}

      {/* Fecha */}
      <View style={styles.dateSection}>
        <Text style={styles.dateText}>
          Solicitado: {format(contratacion.fechaContratacion, "d 'de' MMMM, yyyy", { locale: es })}
        </Text>
        {contratacion.fechaAprobacion && (
          <Text style={styles.dateText}>
            {contratacion.estaAprobada ? 'Aprobado' : 'Rechazado'}: {format(contratacion.fechaAprobacion, "d 'de' MMMM, yyyy", { locale: es })}
          </Text>
        )}
      </View>

      {/* Notas */}
      {contratacion.notas && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notas:</Text>
          <Text style={styles.notesText}>{contratacion.notas}</Text>
        </View>
      )}

      {/* Acciones para asesores */}
      {showActions && contratacion.estaPendiente && (
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onApprove}
            style={styles.approveButton}
          >
            <Text style={styles.actionButtonText}>✅ Aprobar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={onReject}
            style={styles.rejectButton}
          >
            <Text style={styles.actionButtonText}>❌ Rechazar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botón de chat */}
      {!contratacion.estaPendiente && (
        <TouchableOpacity onPress={onPress} style={styles.chatButton}>
          <Text style={styles.chatButtonText}>💬 Ir al Chat</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.gray[100],
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
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  planDetails: {
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    color: colors.gray[600],
    fontSize: fontSize.sm,
  },
  price: {
    color: colors.primary[600],
    fontWeight: 'bold',
    fontSize: fontSize.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  featureText: {
    color: colors.gray[700],
    fontSize: fontSize.sm,
    flex: 1,
  },
  dateSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  notesSection: {
    backgroundColor: colors.blue[50],
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  notesLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    fontWeight: '500',
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  approveButton: {
    flex: 1,
    backgroundColor: colors.green[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    marginRight: spacing.sm,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: colors.red[500],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  actionButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  chatButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: '600',
  },
});