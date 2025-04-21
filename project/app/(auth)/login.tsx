import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, ArrowLeft } from 'lucide-react-native';
import { Spacing } from '@/constants/Theme';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { login, userType } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: '',
    };

    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
        
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Log in to your {userType === 'worker' ? 'worker' : 'employer'} account
        </Text>
      </View>

      <View style={styles.formContainer}>
        {errors.general ? (
          <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.general}
            </Text>
          </View>
        ) : null}

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={20} color={colors.placeholder} />}
          error={errors.email}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock size={20} color={colors.placeholder} />}
          error={errors.password}
        />

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={[styles.forgotPassword, { color: colors.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <Button
          title="Log In"
          onPress={handleLogin}
          loading={isLoading}
          fullWidth
          style={styles.loginButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.placeholder }]}>
          Don't have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.signupText, { color: colors.primary }]}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.l,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: Spacing.s,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  errorContainer: {
    padding: Spacing.m,
    borderRadius: 8,
    marginBottom: Spacing.m,
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotPassword: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  loginButton: {
    marginTop: Spacing.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  signupText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
});