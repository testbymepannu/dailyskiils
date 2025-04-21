import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Skill, WorkerProfile } from '@/types';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Spacing } from '@/constants/Theme';
import Card from '@/components/UI/Card';
import Avatar from '@/components/UI/Avatar';
import RatingStars from '@/components/UI/RatingStars';
import Tag from '@/components/UI/Tag';
import { MapPin } from 'lucide-react-native';

interface WorkerCardProps {
  worker: WorkerProfile;
  onPress: (worker: WorkerProfile) => void;
}

export default function WorkerCard({ worker, onPress }: WorkerCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const primarySkills = worker.skills
    .filter((skill) => skill.isPrimary)
    .slice(0, 3);

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onPress(worker)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <Avatar 
            source={worker.profileImage} 
            name={worker.name} 
            size={60}
            showBadge={worker.verificationStatus.idVerified}
          />
          
          <View style={styles.headerInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {worker.name}
            </Text>
            
            <View style={styles.ratingContainer}>
              <RatingStars rating={worker.rating} size={16} />
              <Text style={[styles.reviewCount, { color: colors.text }]}>
                ({worker.reviewCount})
              </Text>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={14} color={colors.placeholder} />
              <Text style={[styles.location, { color: colors.placeholder }]}>
                {worker.location?.address || 'Location not specified'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.details}>
          <View style={styles.rateContainer}>
            <Text style={[styles.rateMoney, { color: colors.text }]}>
              ${worker.hourlyRate}/hr
            </Text>
            <Text style={[styles.rateLabel, { color: colors.placeholder }]}>
              Hourly rate
            </Text>
          </View>
          
          <View style={styles.skillsContainer}>
            {primarySkills.map((skill) => (
              <Tag
                key={skill.id}
                label={skill.name}
                color="secondary"
                style={styles.skillTag}
              />
            ))}
            
            {worker.skills.length > 3 && (
              <Text style={[styles.moreSkills, { color: colors.placeholder }]}>
                +{worker.skills.length - 3} more
              </Text>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerInfo: {
    marginLeft: Spacing.m,
    flex: 1,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: Spacing.m,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rateContainer: {
    flexDirection: 'column',
  },
  rateMoney: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  rateLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'flex-end',
  },
  skillTag: {
    marginRight: 4,
    marginBottom: 4,
  },
  moreSkills: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
});