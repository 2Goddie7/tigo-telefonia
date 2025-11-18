import React from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSize } from '../styles/spacing';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  ...textInputProps
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.gray[400]}
          {...textInputProps}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.iconRight}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  inputError: {
    borderColor: colors.red[500],
  },
  iconLeft: {
    marginRight: spacing.md,
  },
  iconRight: {
    marginLeft: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.gray[900],
    fontSize: fontSize.base,
  },
  errorText: {
    color: colors.red[500],
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
  },
});