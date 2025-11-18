import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing, borderRadius, fontSize } from '../styles/spacing';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilter?: () => void;
  showFilter?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onFilter,
  showFilter = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          style={styles.input}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {showFilter && onFilter && (
        <TouchableOpacity onPress={onFilter} style={styles.filterButton}>
          <Text style={styles.filterIcon}>⚙️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.gray[200],
    marginRight: spacing.sm,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    color: colors.gray[900],
    fontSize: fontSize.base,
  },
  clearIcon: {
    color: colors.gray[400],
    fontSize: fontSize.lg,
  },
  filterButton: {
    backgroundColor: colors.primary[600],
    padding: spacing.md,
    borderRadius: borderRadius.xl,
  },
  filterIcon: {
    color: colors.white,
    fontSize: 20,
  },
});