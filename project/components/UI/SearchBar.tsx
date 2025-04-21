import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Search, X } from 'lucide-react-native';
import { BorderRadius, Spacing, ShadowStyles } from '@/constants/Theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  onSubmit,
}: SearchBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const shadowStyle = ShadowStyles[Platform.OS]?.[colorScheme]?.small || {};

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card },
        shadowStyle,
      ]}
    >
      <Search size={20} color={colors.placeholder} style={styles.searchIcon} />
      <TextInput
        style={[
          styles.input,
          { color: colors.text },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={16} color={colors.placeholder} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.l,
    paddingHorizontal: Spacing.m,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.s,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    height: '100%',
  },
  clearButton: {
    padding: Spacing.xs,
  },
});