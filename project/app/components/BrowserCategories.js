import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const browsers = [
  {
    name: 'Chrome',
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#4285F4" />
        <path d="M16 16L29.31 16C28.68 9.59 23.01 4.5 16 4.5C12.24 4.5 8.85 6.25 6.6 9.01L16 16Z" fill="#34A853" />
        <path d="M16 16L6.6 9.01C4.12 12.03 4.12 16.19 6.6 19.21C8.85 21.97 12.24 23.72 16 23.72V16Z" fill="#FBBC05" />
        <path d="M16 16V23.72C19.76 23.72 23.15 21.97 25.4 19.21L16 16Z" fill="#EA4335" />
        <circle cx="16" cy="16" r="6" fill="#FFF" />
        <circle cx="16" cy="16" r="3" fill="#4285F4" />
      </svg>
    ),
  },
  {
    name: 'Firefox',
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#FF7139" />
        <path d="M16 6C11.03 6 7 10.03 7 15C7 19.97 11.03 24 16 24C20.97 24 25 19.97 25 15C25 10.03 20.97 6 16 6ZM16 22C12.13 22 9 18.87 9 15C9 11.13 12.13 8 16 8C19.87 8 23 11.13 23 15C23 18.87 19.87 22 16 22Z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: 'Edge',
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#0078D7" />
        <path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16H16V6Z" fill="#FFF" />
      </svg>
    ),
  },
  {
    name: 'Safari',
    svg: (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="16" fill="#1B9AF7" />
        <path d="M16 9L21 16L16 23L11 16L16 9Z" fill="#FFF" />
      </svg>
    ),
  },
];

export default function BrowserCategories() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Popular Browsers</Text>
      <View style={styles.row}>
        {browsers.map((browser) => (
          <View key={browser.name} style={styles.item}>
            {browser.svg}
            <Text style={styles.label}>{browser.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
  },
});
