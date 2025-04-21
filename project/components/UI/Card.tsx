import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { BorderRadius, ShadowStyles } from '@/constants/Theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'small' | 'medium' | 'large';
  noPadding?: boolean;
}

export default function Card({ 
  children, 
  style, 
  elevation = 'medium',
  noPadding = false,
}: CardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  // Get the shadow style based on platform and elevation
  const shadowStyle = ShadowStyles[Platform.OS]?.[colorScheme]?.[elevation] || {};

  return (
    <View
      style={[
        styles.card,
        !noPadding && styles.padding,
        { backgroundColor: colors.card },
        shadowStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.m,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
});