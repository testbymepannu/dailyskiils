import { Platform } from 'react-native';
import Colors from './Colors';

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  s: 4,
  m: 8,
  l: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const ShadowStyles = Platform.select({
  ios: {
    light: {
      small: {
        shadowColor: Colors.light.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      medium: {
        shadowColor: Colors.light.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      large: {
        shadowColor: Colors.light.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 8,
      },
    },
    dark: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
    },
  },
  android: {
    light: {
      small: { elevation: 2 },
      medium: { elevation: 4 },
      large: { elevation: 8 },
    },
    dark: {
      small: { elevation: 2 },
      medium: { elevation: 4 },
      large: { elevation: 8 },
    }
  },
  web: {
    light: {
      small: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
      medium: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.12)',
      },
      large: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.16)',
      },
    },
    dark: {
      small: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
      },
      medium: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
      },
      large: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.35)',
      },
    },
  },
});

export default {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
  ShadowStyles,
};