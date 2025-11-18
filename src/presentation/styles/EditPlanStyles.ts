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

  imagePicker: {
    backgroundColor: colors.gray100,
    height: 192, // h-48
    borderRadius: radius.xl,
    marginBottom: spacing[6],
    alignItems: 'center',
    justifyContent: 'center',
  },

  imagePickerText: {
    color: colors.gray500,
    fontSize: typography.base,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: radius.xl,
  },

  bottomSpacing: {
    height: spacing[8],
  },
});
