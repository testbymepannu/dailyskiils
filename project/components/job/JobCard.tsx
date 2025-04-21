import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Job } from '@/types';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { Spacing } from '@/constants/Theme';
import Card from '@/components/UI/Card';
import Tag from '@/components/UI/Tag';
import { MapPin, Clock, Users } from 'lucide-react-native';

interface JobCardProps {
  job: Job;
  onPress: (job: Job) => void;
}

export default function JobCard({ job, onPress }: JobCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getDurationText = () => {
    if (job.duration.estimatedDays) {
      return `${job.duration.estimatedDays} day${job.duration.estimatedDays > 1 ? 's' : ''}`;
    } else if (job.duration.estimatedHours) {
      return `${job.duration.estimatedHours} hour${job.duration.estimatedHours > 1 ? 's' : ''}`;
    } else if (job.duration.endDate) {
      return `Until ${formatDate(job.duration.endDate)}`;
    }
    return 'Flexible';
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'open':
        return 'success';
      case 'in-progress':
        return 'accent';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onPress(job)}
    >
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {job.title}
            </Text>
            
            {job.isUrgent && (
              <Tag label="Urgent" color="error" style={styles.urgentTag} />
            )}
          </View>
          
          <View style={styles.statusContainer}>
            <Tag 
              label={job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('-', ' ')} 
              color={getStatusColor()} 
              selected
            />
          </View>
        </View>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <MapPin size={14} color={colors.placeholder} />
            <Text style={[styles.metaText, { color: colors.placeholder }]} numberOfLines={1}>
              {job.location.address}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Clock size={14} color={colors.placeholder} />
            <Text style={[styles.metaText, { color: colors.placeholder }]}>
              {formatDate(job.duration.startDate)} • {getDurationText()}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Users size={14} color={colors.placeholder} />
            <Text style={[styles.metaText, { color: colors.placeholder }]}>
              {job.applications.length} applicant{job.applications.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.footer}>
          <View style={styles.budgetContainer}>
            <Text style={[styles.budget, { color: colors.text }]}>
              ${job.budget.minRate}{job.budget.maxRate > job.budget.minRate ? ` - $${job.budget.maxRate}` : ''}
            </Text>
            <Text style={[styles.budgetType, { color: colors.placeholder }]}>
              {job.budget.isHourly ? 'Per hour' : 'Per day'}
            </Text>
          </View>
          
          <View style={styles.skillsContainer}>
            {job.skills.slice(0, 2).map((skill, index) => (
              <Tag
                key={index}
                label={skill}
                color="secondary"
                style={styles.skillTag}
              />
            ))}
            
            {job.skills.length > 2 && (
              <Text style={[styles.moreSkills, { color: colors.placeholder }]}>
                +{job.skills.length - 2} more
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.s,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.s,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  urgentTag: {
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  metaInfo: {
    marginBottom: Spacing.s,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: Spacing.s,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetContainer: {
    flexDirection: 'column',
  },
  budget: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  budgetType: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  skillTag: {
    marginLeft: 4,
  },
  moreSkills: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
});