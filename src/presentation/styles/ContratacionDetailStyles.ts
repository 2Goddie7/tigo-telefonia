import { StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },

  headerContainer: {
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
  },

  backIcon: {
    fontSize: typography['2xl'],
  },

  title: {
    fontSize: typography['3xl'],
    fontWeight: 'bold',
    color: colors.gray900,
    marginTop: spacing[4],
  },

  estadoContainer: {
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },

  estadoText: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  card: {
    backgroundColor: colors.gray50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[4],
  },

  cardLabel: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing[3],
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 48,
    height: 48,
    backgroundColor: colors.primary600,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },

  avatarText: {
    color: colors.white,
    fontSize: typography.xl,
    fontWeight: 'bold',
  },

  userName: {
    fontSize: typography.lg,
    fontWeight: 'bold',
    color: colors.gray900,
  },

  subText: {
    color: colors.gray600,
    fontSize: typography.base,
    marginTop: 2,
  },

  planTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing[2],
  },

  planPrice: {
    fontSize: typography['2xl'],
    fontWeight: 'bold',
    color: colors.primary600,
  },

  planFeatures: {
    marginTop: spacing[3],
    gap: spacing[1],
  },

  notesContainer: {
    backgroundColor: colors.primary50,
    padding: spacing[4],
    borderRadius: radius.xl,
    marginBottom: spacing[6],
  },

  actions: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },

  bottomSpacing: {
    height: spacing[8],
  },
});
