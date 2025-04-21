import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/Theme';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import WorkerCard from '@/components/worker/WorkerCard';
import JobCard from '@/components/job/JobCard';
import { MapPin, Plus, TrendingUp, Clock, Star, Wrench, Plug, Hammer, Paintbrush } from 'lucide-react-native';
import { Job, WorkerProfile } from '@/types';
import { mockWorkers } from '@/data/mockWorkers';
import { mockJobs } from '@/data/mockJobs';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, userType } = useAuth();
  
  const [featuredWorkers, setFeaturedWorkers] = useState<WorkerProfile[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [greeting, setGreeting] = useState('Good morning');
  
  useEffect(() => {
    // Set greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good morning');
    } else if (hours < 18) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
    
    // Fetch featured workers
    setFeaturedWorkers(mockWorkers.slice(0, 5));
    
    // Fetch recent jobs
    setRecentJobs(mockJobs.slice(0, 5));
  }, []);
  
  const renderHeader = () => {
    if (userType === 'worker') {
      return (
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Find Your Next Job
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.placeholder }]}>
                Browse available jobs that match your skills
              </Text>
            </View>
            
            <Button
              title="Find Jobs"
              onPress={() => router.push('/search')}
              size="small"
            />
          </View>
        </Card>
      );
    } else {
      return (
        <Card style={styles.headerCard}>
          <View style={styles.headerContent}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Need a Skilled Worker?
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.placeholder }]}>
                Post a job or browse available workers
              </Text>
            </View>
            
            <Button
              title="Post a Job"
              onPress={() => router.push('/jobs/create')}
              size="small"
              icon={<Plus size={16} color="white" />}
            />
          </View>
        </Card>
      );
    }
  };
  
  const renderCategoryItem = ({ item }: { item: { id: string, name: string, icon: React.ReactNode } }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        { backgroundColor: colors.card }
      ]}
      onPress={() => router.push({ pathname: '/search', params: { category: item.id } })}
    >
      <View style={[styles.categoryIcon, { backgroundColor: `${colors.primary}20` }]}>
        {item.icon}
      </View>
      <Text style={[styles.categoryName, { color: colors.text }]} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  const handlePressWorker = (worker: WorkerProfile) => {
    // In a real app, navigate to worker profile
    console.log('View worker profile:', worker.id);
  };
  
  const handlePressJob = (job: Job) => {
    // In a real app, navigate to job details
    console.log('View job details:', job.id);
  };
  
  const categories = [
    {
      id: 'plumbing',
      name: 'Plumbing',
      icon: <Wrench size={28} color={colors.primary} />,
    },
    {
      id: 'electrical',
      name: 'Electrical',
      icon: <Plug size={28} color={colors.primary} />,
    },
    {
      id: 'carpentry',
      name: 'Carpentry',
      icon: <Hammer size={28} color={colors.primary} />,
    },
    {
      id: 'painting',
      name: 'Painting',
      icon: <Paintbrush size={28} color={colors.primary} />,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.greetingContainer}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          {greeting}, {user?.name?.split(' ')[0] || 'there'}
        </Text>
        
        <Text style={[styles.date, { color: colors.placeholder }]}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Text>
      </View>
      
      {renderHeader()}
      
      <View style={styles.categoriesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Browse Categories
          </Text>
        </View>
        
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {userType === 'employer' && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Workers
            </Text>
            <TouchableOpacity onPress={() => router.push('/search')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {featuredWorkers.map((worker) => (
            <WorkerCard
              key={worker.id}
              worker={worker}
              onPress={handlePressWorker}
            />
          ))}
        </View>
      )}
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {userType === 'worker' ? 'Jobs For You' : 'Recent Postings'}
          </Text>
          <TouchableOpacity onPress={() => router.push('/jobs')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
        
        {recentJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onPress={handlePressJob}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: Spacing.l,
    paddingBottom: 40,
  },
  greetingContainer: {
    marginBottom: Spacing.m,
  },
  greeting: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
  },
  date: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  headerCard: {
    marginBottom: Spacing.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
    marginRight: Spacing.m,
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  categoriesContainer: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  seeAllText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  categoriesList: {
    paddingVertical: Spacing.s,
  },
  categoryItem: {
    marginRight: Spacing.m,
    padding: Spacing.m,
    borderRadius: 12,
    alignItems: 'center',
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  categoryName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
});