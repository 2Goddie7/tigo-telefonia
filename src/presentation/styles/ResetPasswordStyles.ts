// src/presentation/styles/ResetPasswordStyles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  scroll: {
    flex: 1,
    paddingHorizontal: spacing[6],
  },

  header: {
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

  formContainer: {
    paddingVertical: spacing[6],
  },

  icon: {
    fontSize: typography.xl,
  },
});
