import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { X } from 'lucide-react-native';
import { BorderRadius, Spacing } from '@/constants/Theme';

interface TagProps {
  label: string;
  onPress?: () => void;
  onRemove?: () => void;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  selected?: boolean;
  style?: ViewStyle;
}

export default function Tag({
  label,
  onPress,
  onRemove,
  color = 'primary',
  selected = false,
  style,
}: TagProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const getBackgroundColor = () => {
    if (selected) {
      return colors[color];
    }
    
    // Create a lighter version for unselected tags
    switch (color) {
      case 'primary':
        return 'rgba(74, 128, 240, 0.1)';
      case 'secondary':
        return 'rgba(44, 204, 228, 0.1)';
      case 'accent':
        return 'rgba(255, 140, 66, 0.1)';
      case 'success':
        return 'rgba(52, 211, 153, 0.1)';
      case 'warning':
        return 'rgba(251, 191, 36, 0.1)';
      case 'error':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'rgba(74, 128, 240, 0.1)';
    }
  };

  const getTextColor = () => {
    if (selected) {
      return 'white';
    }
    return colors[color];
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: getTextColor(),
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <X
            size={14}
            color={getTextColor()}
          />
        </TouchableOpacity>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  removeButton: {
    marginLeft: Spacing.xs,
  },
});