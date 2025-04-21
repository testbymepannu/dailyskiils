import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/UI/Button';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/Theme';

export default function WelcomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (user && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[styles.appName, { color: colors.primary }]}>
            DailySkills
          </Text>
        </View>

        <Image
          source={{ uri: 'https://images.pexels.com/photos/8961251/pexels-photo-8961251.jpeg' }}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Connect with skilled workers
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            Find skilled workers or get hired for daily wage jobs easily with our platform
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/register')}
          fullWidth
          size="large"
        />
        
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.placeholder }]}>
            Already have an account?
          </Text>
          <Button
            title="Log In"
            onPress={() => router.push('/login')}
            variant="ghost"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  appName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
  },
  heroImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    width: '100%',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.m,
  },
  loginText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});