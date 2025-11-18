// src/presentation/styles/PlanDetailStyles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  backContainer: {
    paddingHorizontal: spacing[6],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },

  backIcon: {
    fontSize: typography['2xl'],
  },

  image: {
    width: '100%',
    height: 190,
  },

  content: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[6],
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[4],
  },

  headerInfo: {
    flex: 1,
  },

  planName: {
    fontSize: typography['3xl'],
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing[2],
  },

  segmento: {
    color: colors.gray600,
    fontSize: typography.base,
  },

  price: {
    fontSize: typography['4xl'],
    fontWeight: 'bold',
    color: colors.primary600,
  },

  detailBox: {
    backgroundColor: colors.gray50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },

  detailIcon: {
    fontSize: typography['2xl'],
    marginRight: spacing[3],
  },

  detailLabel: {
    flex: 1,
    color: colors.gray600,
    fontSize: typography.base,
  },

  detailValue: {
    flex: 2,
    textAlign: 'right',
    color: colors.gray900,
    fontWeight: '600',
    fontSize: typography.base,
  },

  targetBox: {
    backgroundColor: colors.primary50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },

  targetLabel: {
    color: colors.gray700,
    fontWeight: '600',
    fontSize: typography.sm,
    marginBottom: spacing[2],
  },

  targetText: {
    color: colors.gray600,
    fontSize: typography.base,
  },

  buttonsContainer: {
    gap: spacing[3],
  },
});
