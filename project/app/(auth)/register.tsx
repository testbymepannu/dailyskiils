import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import UserTypeSelector from '@/components/auth/UserTypeSelector';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import { Spacing } from '@/constants/Theme';
import { UserType } from '@/types';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { register, setUserType } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userTypeValue, setUserTypeValue] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: '',
    general: '',
  });
  
  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: '',
      general: '',
    };

    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!userTypeValue) {
      newErrors.userType = 'Please select your account type';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      // Set user type in context
      setUserType(userTypeValue);
      // Register user
      await register(email, password, name);
      router.replace('/(tabs)');
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserTypeValue(type);
    setErrors({
      ...errors,
      userType: '',
    });
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
        
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        
        <Text style={[styles.subtitle, { color: colors.placeholder }]}>
          Join DailySkills to connect with workers and employers
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

        <UserTypeSelector
          selectedType={userTypeValue}
          onSelect={handleUserTypeSelect}
        />
        {errors.userType ? (
          <Text style={[styles.fieldError, { color: colors.error }]}>
            {errors.userType}
          </Text>
        ) : null}

        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          leftIcon={<User size={20} color={colors.placeholder} />}
          error={errors.name}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={20} color={colors.placeholder} />}
          error={errors.email}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<Lock size={20} color={colors.placeholder} />}
          error={errors.password}
          containerStyle={styles.inputContainer}
        />

        <Input
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          leftIcon={<Lock size={20} color={colors.placeholder} />}
          error={errors.confirmPassword}
          containerStyle={styles.inputContainer}
        />

        <Button
          title="Create Account"
          onPress={handleRegister}
          loading={isLoading}
          fullWidth
          style={styles.registerButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.placeholder }]}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={[styles.loginText, { color: colors.primary }]}>
            Log In
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
  fieldError: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: -8,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: Spacing.m,
  },
  registerButton: {
    marginTop: Spacing.xl,
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
  loginText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
});