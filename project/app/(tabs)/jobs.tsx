import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/Theme';
import Button from '@/components/UI/Button';
import Card from '@/components/UI/Card';
import JobCard from '@/components/job/JobCard';
import { Plus, BriefcaseBusiness } from 'lucide-react-native';
import { mockJobs } from '@/data/mockJobs';
import { Job, JobStatus } from '@/types';

export default function JobsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { userType } = useAuth();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [activeFilter, setActiveFilter] = useState<JobStatus | 'all'>('all');
  
  useEffect(() => {
    // In a real app, you would fetch jobs from an API
    const fetchedJobs = mockJobs;
    setJobs(fetchedJobs);
    setFilteredJobs(fetchedJobs);
  }, []);
  
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.status === activeFilter));
    }
  }, [activeFilter, jobs]);
  
  const handleFilter = (filter: JobStatus | 'all') => {
    setActiveFilter(filter);
  };
  
  const handlePressJob = (job: Job) => {
    // In a real app, navigate to job details
    console.log('Viewing job:', job.id);
  };
  
  const renderEmployerContent = () => (
    <>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Jobs</Text>
        <Button
          title="Post a Job"
          onPress={() => router.push('/jobs/create')}
          icon={<Plus size={16} color="white" />}
          size="small"
        />
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'all' ? 'white' : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'open' && { backgroundColor: colors.success },
          ]}
          onPress={() => handleFilter('open')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'open' ? 'white' : colors.text },
            ]}
          >
            Open
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'in-progress' && { backgroundColor: colors.accent },
          ]}
          onPress={() => handleFilter('in-progress')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'in-progress' ? 'white' : colors.text },
            ]}
          >
            In Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'completed' && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleFilter('completed')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'completed' ? 'white' : colors.text },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'cancelled' && { backgroundColor: colors.error },
          ]}
          onPress={() => handleFilter('cancelled')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'cancelled' ? 'white' : colors.text },
            ]}
          >
            Cancelled
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {filteredJobs.length > 0 ? (
        filteredJobs.map(job => (
          <JobCard key={job.id} job={job} onPress={handlePressJob} />
        ))
      ) : (
        <Card style={styles.emptyContainer}>
          <BriefcaseBusiness size={48} color={colors.placeholder} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No jobs found
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.placeholder }]}>
            {activeFilter === 'all'
              ? "You haven't posted any jobs yet"
              : `You don't have any ${activeFilter} jobs`}
          </Text>
          <Button
            title="Post a New Job"
            onPress={() => router.push('/jobs/create')}
            style={styles.emptyButton}
          />
        </Card>
      )}
    </>
  );
  
  const renderWorkerContent = () => (
    <>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Jobs</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'all' ? 'white' : colors.text },
            ]}
          >
            All Applications
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'open' && { backgroundColor: colors.success },
          ]}
          onPress={() => handleFilter('open')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'open' ? 'white' : colors.text },
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'in-progress' && { backgroundColor: colors.accent },
          ]}
          onPress={() => handleFilter('in-progress')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'in-progress' ? 'white' : colors.text },
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'completed' && { backgroundColor: colors.primary },
          ]}
          onPress={() => handleFilter('completed')}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === 'completed' ? 'white' : colors.text },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      {filteredJobs.length > 0 ? (
        filteredJobs.map(job => (
          <JobCard key={job.id} job={job} onPress={handlePressJob} />
        ))
      ) : (
        <Card style={styles.emptyContainer}>
          <BriefcaseBusiness size={48} color={colors.placeholder} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No applications found
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.placeholder }]}>
            {activeFilter === 'all'
              ? "You haven't applied to any jobs yet"
              : `You don't have any ${activeFilter} applications`}
          </Text>
          <Button
            title="Find Jobs"
            onPress={() => router.push('/search')}
            style={styles.emptyButton}
          />
        </Card>
      )}
    </>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {userType === 'employer' ? renderEmployerContent() : renderWorkerContent()}
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  filtersContainer: {
    paddingBottom: Spacing.m,
  },
  filterButton: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    marginRight: Spacing.s,
    backgroundColor: '#E2E8F0',
  },
  filterText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginTop: Spacing.m,
    marginBottom: Spacing.s,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  emptyButton: {
    minWidth: 200,
  },
});