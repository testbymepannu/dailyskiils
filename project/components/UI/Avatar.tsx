import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { BorderRadius } from '@/constants/Theme';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  showBadge?: boolean;
  badgeColor?: string;
}

export default function Avatar({
  source,
  name,
  size = 40,
  showBadge = false,
  badgeColor,
}: AvatarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  // Get initials from name
  const getInitials = () => {
    if (!name) return '';
    
    const nameParts = name.split(' ').filter(Boolean);
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    } else if (nameParts.length > 1) {
      return (
        nameParts[0].charAt(0).toUpperCase() +
        nameParts[nameParts.length - 1].charAt(0).toUpperCase()
      );
    }
    return '';
  };

  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
      );
    }

    return (
      <View
        style={[
          styles.initialsContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text
          style={[
            styles.initials,
            {
              fontSize: size * 0.4,
              color: 'white',
            },
          ]}
        >
          {getInitials()}
        </Text>
      </View>
    );
  };

  const badgeSize = size * 0.35;

  return (
    <View style={styles.container}>
      {renderContent()}
      
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: badgeColor || colors.success,
              borderColor: colors.card,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    overflow: 'hidden',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontFamily: 'Inter-SemiBold',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
  },
});