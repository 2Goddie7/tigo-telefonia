// src/presentation/styles/ChatScreenStyles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography, radius } from '../../theme';

export const styles = StyleSheet.create({
  flex1: { flex: 1 },

  safeArea: {
    flex: 1,
    backgroundColor: colors.white,
  },

  /** HEADER */
  header: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerBackButton: {
    marginRight: spacing[4],
  },

  headerBackIcon: {
    fontSize: typography['2xl'],
  },

  headerTitle: {
    fontSize: typography.xl,
    fontWeight: 'bold',
  },

  typingText: {
    fontSize: typography.sm,
    color: colors.success,
  },

  /** CHAT */
  chatScroll: {
    flex: 1,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
  },

  /** INPUT */
  inputContainer: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
  },

  messageInput: {
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginRight: spacing[2],
  },

  sendButton: {
    backgroundColor: colors.primary600,
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sendButtonIcon: {
    color: colors.white,
    fontSize: typography.xl,
  },
});
