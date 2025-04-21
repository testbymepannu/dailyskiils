import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Star } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';

interface RatingStarsProps {
  rating: number;
  size?: number;
  maxRating?: number;
  style?: ViewStyle;
  showEmpty?: boolean;
}

export default function RatingStars({
  rating,
  size = 16,
  maxRating = 5,
  style,
  showEmpty = true,
}: RatingStarsProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  
  const renderStars = () => {
    const stars = [];
    
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= Math.floor(rating);
      const isHalf = !isFilled && i === Math.ceil(rating) && rating % 1 >= 0.5;
      
      if (isFilled) {
        stars.push(
          <Star
            key={i}
            size={size}
            fill={colors.warning}
            color={colors.warning}
            style={styles.star}
          />
        );
      } else if (isHalf) {
        // This is a simplified half-star representation
        stars.push(
          <View key={i} style={styles.halfStarContainer}>
            <Star
              size={size}
              color={colors.warning}
              style={[styles.star, styles.emptyHalfStar]}
            />
            <View style={styles.halfStarOverlay}>
              <Star
                size={size}
                fill={colors.warning}
                color={colors.warning}
                style={styles.star}
              />
            </View>
          </View>
        );
      } else if (showEmpty) {
        stars.push(
          <Star
            key={i}
            size={size}
            color={colors.warning}
            style={styles.star}
          />
        );
      }
    }
    
    return stars;
  };

  return <View style={[styles.container, style]}>{renderStars()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  halfStarContainer: {
    position: 'relative',
  },
  emptyHalfStar: {
    opacity: 0.3,
  },
  halfStarOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '50%',
    height: '100%',
    overflow: 'hidden',
  },
});