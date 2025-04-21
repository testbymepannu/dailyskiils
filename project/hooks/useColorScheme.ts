import { useColorScheme as useDeviceColorScheme } from 'react-native';

export default function useColorScheme() {
  return useDeviceColorScheme() || 'light';
}