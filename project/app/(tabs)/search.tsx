import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/Theme';
import Card from '@/components/UI/Card';
import SearchBar from '@/components/UI/SearchBar';
import Tag from '@/components/UI/Tag';
import WorkerCard from '@/components/worker/WorkerCard';
import JobCard from '@/components/job/JobCard';
import { FileSliders as Sliders, MapPin } from 'lucide-react-native';
import { mockWorkers } from '@/data/mockWorkers';
import { mockJobs } from '@/data/mockJobs';
import { Job, WorkerProfile } from '@/types';

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const initialCategory = params.category as string | undefined;
  
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { userType } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const [workers, setWorkers] = useState<WorkerProfile[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Categories
  const categories = [
    { id: 'all', name: 'All' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'carpentry', name: 'Carpentry' },
    { id: 'painting', name: 'Painting' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'gardening', name: 'Gardening' },
    { id: 'moving', name: 'Moving' },
  ];
  
  useEffect(() => {
    performSearch();
  }, [selectedCategory]);
  
  const performSearch = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      // Filter based on category
      if (userType === 'employer') {
        let filteredWorkers = [...mockWorkers];
        
        if (selectedCategory && selectedCategory !== 'all') {
          filteredWorkers = filteredWorkers.filter(worker => 
            worker.skills.some(skill => skill.category.toLowerCase() === selectedCategory.toLowerCase())
          );
        }
        
        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredWorkers = filteredWorkers.filter(worker => 
            worker.name.toLowerCase().includes(query) || 
            worker.skills.some(skill => skill.name.toLowerCase().includes(query))
          );
        }
        
        setWorkers(filteredWorkers);
      } else {
        let filteredJobs = [...mockJobs];
        
        if (selectedCategory && selectedCategory !== 'all') {
          filteredJobs = filteredJobs.filter(job => 
            job.category.toLowerCase() === selectedCategory.toLowerCase()
          );
        }
        
        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredJobs = filteredJobs.filter(job => 
            job.title.toLowerCase().includes(query) || 
            job.description.toLowerCase().includes(query) ||
            job.skills.some(skill => skill.toLowerCase().includes(query))
          );
        }
        
        setJobs(filteredJobs);
      }
      
      setIsLoading(false);
    }, 500);
  };
  
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId === 'all' ? null : categoryId);
  };
  
  const handleSearch = () => {
    performSearch();
  };
  
  const renderCategoryItem = ({ item }: { item: { id: string; name: string } }) => (
    <Tag
      label={item.name}
      selected={selectedCategory === item.id || (item.id === 'all' && !selectedCategory)}
      onPress={() => handleCategoryPress(item.id)}
      color="primary"
      style={styles.categoryTag}
    />
  );
  
  const handlePressWorker = (worker: WorkerProfile) => {
    // In a real app, navigate to worker profile
    console.log('View worker profile:', worker.id);
  };
  
  const handlePressJob = (job: Job) => {
    // In a real app, navigate to job details
    console.log('View job details:', job.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {userType === 'employer' ? 'Find Workers' : 'Find Jobs'}
        </Text>
        
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={userType === 'employer' ? 'Search for workers or skills' : 'Search for jobs'}
            onSubmit={handleSearch}
          />
          
          <TouchableOpacity 
            style={[
              styles.filterButton,
              { backgroundColor: colors.card },
            ]}
          >
            <Sliders size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationContainer}>
          <MapPin size={16} color={colors.primary} />
          <Text style={[styles.locationText, { color: colors.text }]}>
            New York, NY
          </Text>
          <TouchableOpacity>
            <Text style={[styles.changeText, { color: colors.primary }]}>
              Change
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <ScrollView 
        style={styles.resultsContainer}
        contentContainerStyle={styles.resultsContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Card>
            <Text style={{ color: colors.placeholder, textAlign: 'center' }}>
              Loading...
            </Text>
          </Card>
        ) : userType === 'employer' ? (
          workers.length > 0 ? (
            workers.map(worker => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onPress={handlePressWorker}
              />
            ))
          ) : (
            <Card>
              <Text style={{ color: colors.placeholder, textAlign: 'center' }}>
                No workers found. Try adjusting your search.
              </Text>
            </Card>
          )
        ) : (
          jobs.length > 0 ? (
            jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onPress={handlePressJob}
              />
            ))
          ) : (
            <Card>
              <Text style={{ color: colors.placeholder, textAlign: 'center' }}>
                No jobs found. Try adjusting your search.
              </Text>
            </Card>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    marginBottom: Spacing.m,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  changeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: Spacing.s,
  },
  categoriesContainer: {
    marginBottom: Spacing.m,
  },
  categoriesList: {
    paddingHorizontal: Spacing.l,
  },
  categoryTag: {
    marginRight: Spacing.s,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: 100,
  },
});