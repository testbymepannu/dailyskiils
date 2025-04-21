import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { UserType } from '@/types';
import Card from '@/components/UI/Card';
import { Briefcase, Wrench } from 'lucide-react-native';
import { BorderRadius, Spacing } from '@/constants/Theme';

interface UserTypeSelectorProps {
  selectedType: UserType;
  onSelect: (type: UserType) => void;
}

export default function UserTypeSelector({
  selectedType,
  onSelect,
}: UserTypeSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        I am a...
      </Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.option,
            {
              borderColor: selectedType === 'worker' ? colors.primary : colors.border,
              backgroundColor: selectedType === 'worker' ? `${colors.primary}10` : colors.card,
            },
          ]}
          onPress={() => onSelect('worker')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: selectedType === 'worker' ? colors.primary : colors.lightGray,
              },
            ]}
          >
            <Wrench
              size={24}
              color={selectedType === 'worker' ? 'white' : colors.primary}
            />
          </View>
          
          <Text style={[styles.optionTitle, { color: colors.text }]}>
            Skilled Worker
          </Text>
          
          <Text style={[styles.optionDescription, { color: colors.placeholder }]}>
            Find jobs and connect with employers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.option,
            {
              borderColor: selectedType === 'employer' ? colors.primary : colors.border,
              backgroundColor: selectedType === 'employer' ? `${colors.primary}10` : colors.card,
            },
          ]}
          onPress={() => onSelect('employer')}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: selectedType === 'employer' ? colors.primary : colors.lightGray,
              },
            ]}
          >
            <Briefcase
              size={24}
              color={selectedType === 'employer' ? 'white' : colors.primary}
            />
          </View>
          
          <Text style={[styles.optionTitle, { color: colors.text }]}>
            Employer
          </Text>
          
          <Text style={[styles.optionDescription, { color: colors.placeholder }]}>
            Post jobs and hire skilled workers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: Spacing.m,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    borderWidth: 2,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  optionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
});