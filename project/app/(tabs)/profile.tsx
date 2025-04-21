import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';
import useColorScheme from '@/hooks/useColorScheme';
import { useAuth } from '@/contexts/AuthContext';
import { Spacing } from '@/constants/Theme';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import RatingStars from '@/components/UI/RatingStars';
import Tag from '@/components/UI/Tag';
import Avatar from '@/components/UI/Avatar';
import { Settings, LogOut, MapPin, Phone, Mail, Calendar, Star, CreditCard as Edit } from 'lucide-react-native';
import { WorkerProfile, EmployerProfile } from '@/types';
import { mockWorkers } from '@/data/mockWorkers';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const { user, userType, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState(userType === 'worker' ? 'portfolio' : 'jobs');
  
  // Mock profile data
  const workerProfile: WorkerProfile = {
    ...mockWorkers[0],
    id: user?.id || '123',
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+1234567890',
    userType: 'worker',
  };
  
  const employerProfile: EmployerProfile = {
    id: user?.id || '123',
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+1234567890',
    userType: 'employer',
    companyName: 'ABC Construction',
    rating: 4.8,
    reviewCount: 24,
    jobsPosted: 12,
    createdAt: new Date(),
  };
  
  const handleLogout = () => {
    logout();
    router.replace('/welcome');
  };
  
  const renderWorkerProfile = () => (
    <>
      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderContent}>
          <Text style={[styles.name, { color: colors.text }]}>{workerProfile.name}</Text>
          
          <View style={styles.ratingContainer}>
            <RatingStars rating={workerProfile.rating} size={18} />
            <Text style={[styles.reviewCount, { color: colors.text }]}>
              ({workerProfile.reviewCount})
            </Text>
          </View>
          
          <Text style={[styles.bio, { color: colors.placeholder }]}>
            {workerProfile.bio}
          </Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <MapPin size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {workerProfile.location?.address || 'Location not set'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Phone size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {workerProfile.phone}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Mail size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {workerProfile.email}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                Member since {workerProfile.createdAt.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>
        
        <Avatar
          source={workerProfile.profileImage}
          name={workerProfile.name}
          size={80}
          showBadge={workerProfile.verificationStatus.idVerified}
        />
      </View>
      
      <View style={styles.ratesContainer}>
        <View style={styles.rateItem}>
          <Text style={[styles.rateValue, { color: colors.text }]}>
            ${workerProfile.hourlyRate}
          </Text>
          <Text style={[styles.rateLabel, { color: colors.placeholder }]}>
            Hourly Rate
          </Text>
        </View>
        
        <View style={styles.rateDivider} />
        
        <View style={styles.rateItem}>
          <Text style={[styles.rateValue, { color: colors.text }]}>
            ${workerProfile.dailyRate}
          </Text>
          <Text style={[styles.rateLabel, { color: colors.placeholder }]}>
            Daily Rate
          </Text>
        </View>
      </View>
      
      <View style={styles.skillsContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Skills
        </Text>
        
        <View style={styles.skillTags}>
          {workerProfile.skills.map((skill) => (
            <Tag
              key={skill.id}
              label={`${skill.name} (${skill.yearsExperience}+ years)`}
              color={skill.isPrimary ? 'primary' : 'secondary'}
              style={styles.skillTag}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'portfolio' && styles.activeTab,
            activeTab === 'portfolio' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('portfolio')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'portfolio' ? colors.primary : colors.placeholder },
            ]}
          >
            Portfolio
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'reviews' && styles.activeTab,
            activeTab === 'reviews' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'reviews' ? colors.primary : colors.placeholder },
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'experience' && styles.activeTab,
            activeTab === 'experience' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('experience')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'experience' ? colors.primary : colors.placeholder },
            ]}
          >
            Experience
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'portfolio' && (
        <View style={styles.portfolioContainer}>
          {workerProfile.portfolio.length > 0 ? (
            <View style={styles.portfolioGrid}>
              {workerProfile.portfolio.map((item) => (
                <TouchableOpacity key={item.id} style={styles.portfolioItem}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.portfolioImage}
                    resizeMode="cover"
                  />
                  <View style={[styles.portfolioOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                    <Text style={styles.portfolioTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No portfolio items yet
              </Text>
              <Text style={[styles.emptyMessage, { color: colors.placeholder }]}>
                Add your work samples to showcase your skills
              </Text>
              <Button
                title="Add Work"
                onPress={() => console.log('Add portfolio item')}
                style={styles.emptyButton}
              />
            </Card>
          )}
        </View>
      )}
      
      {activeTab === 'reviews' && (
        <View style={styles.reviewsContainer}>
          <Card style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                <Avatar size={40} name="Jane Smith" />
                <View style={styles.reviewUserInfo}>
                  <Text style={[styles.reviewUserName, { color: colors.text }]}>
                    Jane Smith
                  </Text>
                  <Text style={[styles.reviewDate, { color: colors.placeholder }]}>
                    Oct 15, 2023
                  </Text>
                </View>
              </View>
              <RatingStars rating={5} size={16} />
            </View>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              John did an excellent job with the plumbing work in our bathroom. He was professional, punctual, and completed the work to a high standard. Would definitely hire again.
            </Text>
          </Card>
          
          <Card style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                <Avatar size={40} name="Robert Johnson" />
                <View style={styles.reviewUserInfo}>
                  <Text style={[styles.reviewUserName, { color: colors.text }]}>
                    Robert Johnson
                  </Text>
                  <Text style={[styles.reviewDate, { color: colors.placeholder }]}>
                    Sep 28, 2023
                  </Text>
                </View>
              </View>
              <RatingStars rating={4.5} size={16} />
            </View>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              Very skilled worker with great attention to detail. Completed the job ahead of schedule and within budget. Highly recommended.
            </Text>
          </Card>
        </View>
      )}
      
      {activeTab === 'experience' && (
        <View style={styles.experienceContainer}>
          {workerProfile.experience.map((exp, index) => (
            <Card key={exp.id} style={styles.experienceCard}>
              <View style={styles.experienceHeader}>
                <View>
                  <Text style={[styles.experienceTitle, { color: colors.text }]}>
                    {exp.title}
                  </Text>
                  {exp.company && (
                    <Text style={[styles.experienceCompany, { color: colors.placeholder }]}>
                      at {exp.company}
                    </Text>
                  )}
                </View>
                <Text style={[styles.experienceDuration, { color: colors.placeholder }]}>
                  {exp.startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.isCurrent ? 'Present' : exp.endDate?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Text>
              </View>
              <Text style={[styles.experienceDescription, { color: colors.text }]}>
                {exp.description}
              </Text>
            </Card>
          ))}
        </View>
      )}
    </>
  );
  
  const renderEmployerProfile = () => (
    <>
      <View style={styles.profileHeader}>
        <View style={styles.profileHeaderContent}>
          <Text style={[styles.name, { color: colors.text }]}>{employerProfile.name}</Text>
          
          {employerProfile.companyName && (
            <Text style={[styles.companyName, { color: colors.primary }]}>
              {employerProfile.companyName}
            </Text>
          )}
          
          <View style={styles.ratingContainer}>
            <RatingStars rating={employerProfile.rating} size={18} />
            <Text style={[styles.reviewCount, { color: colors.text }]}>
              ({employerProfile.reviewCount})
            </Text>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Phone size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {employerProfile.phone}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Mail size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {employerProfile.email}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Calendar size={16} color={colors.primary} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                Member since {employerProfile.createdAt.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>
        </View>
        
        <Avatar
          source={employerProfile.profileImage}
          name={employerProfile.name}
          size={80}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {employerProfile.jobsPosted}
          </Text>
          <Text style={[styles.statLabel, { color: colors.placeholder }]}>
            Jobs Posted
          </Text>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.statItem}>
          <View style={styles.statValueContainer}>
            <Star size={16} color={colors.warning} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {employerProfile.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.statLabel, { color: colors.placeholder }]}>
            Rating
          </Text>
        </View>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'jobs' && styles.activeTab,
            activeTab === 'jobs' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('jobs')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'jobs' ? colors.primary : colors.placeholder },
            ]}
          >
            Jobs
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'reviews' && styles.activeTab,
            activeTab === 'reviews' && { borderBottomColor: colors.primary },
          ]}
          onPress={() => setActiveTab('reviews')}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'reviews' ? colors.primary : colors.placeholder },
            ]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'jobs' && (
        <View style={styles.jobStatsContainer}>
          <Card style={styles.jobStatsCard}>
            <Text style={[styles.jobStatsTitle, { color: colors.text }]}>
              Job Statistics
            </Text>
            
            <View style={styles.jobStatItem}>
              <View style={styles.jobStatLabel}>
                <Text style={[styles.jobStatLabelText, { color: colors.text }]}>
                  Open Jobs
                </Text>
              </View>
              <View style={[styles.jobStatBar, { backgroundColor: colors.lightGray }]}>
                <View 
                  style={[
                    styles.jobStatFill, 
                    { backgroundColor: colors.success, width: '40%' }
                  ]} 
                />
              </View>
              <Text style={[styles.jobStatValue, { color: colors.text }]}>
                4
              </Text>
            </View>
            
            <View style={styles.jobStatItem}>
              <View style={styles.jobStatLabel}>
                <Text style={[styles.jobStatLabelText, { color: colors.text }]}>
                  In Progress
                </Text>
              </View>
              <View style={[styles.jobStatBar, { backgroundColor: colors.lightGray }]}>
                <View 
                  style={[
                    styles.jobStatFill, 
                    { backgroundColor: colors.accent, width: '30%' }
                  ]} 
                />
              </View>
              <Text style={[styles.jobStatValue, { color: colors.text }]}>
                3
              </Text>
            </View>
            
            <View style={styles.jobStatItem}>
              <View style={styles.jobStatLabel}>
                <Text style={[styles.jobStatLabelText, { color: colors.text }]}>
                  Completed
                </Text>
              </View>
              <View style={[styles.jobStatBar, { backgroundColor: colors.lightGray }]}>
                <View 
                  style={[
                    styles.jobStatFill, 
                    { backgroundColor: colors.primary, width: '50%' }
                  ]} 
                />
              </View>
              <Text style={[styles.jobStatValue, { color: colors.text }]}>
                5
              </Text>
            </View>
          </Card>
        </View>
      )}
      
      {activeTab === 'reviews' && (
        <View style={styles.reviewsContainer}>
          <Card style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                <Avatar size={40} name="Michael Rodriguez" />
                <View style={styles.reviewUserInfo}>
                  <Text style={[styles.reviewUserName, { color: colors.text }]}>
                    Michael Rodriguez
                  </Text>
                  <Text style={[styles.reviewDate, { color: colors.placeholder }]}>
                    Oct 23, 2023
                  </Text>
                </View>
              </View>
              <RatingStars rating={5} size={16} />
            </View>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              Great employer! Clear communication and prompt payment. Would definitely work with them again.
            </Text>
          </Card>
          
          <Card style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewUser}>
                <Avatar size={40} name="Sarah Wilson" />
                <View style={styles.reviewUserInfo}>
                  <Text style={[styles.reviewUserName, { color: colors.text }]}>
                    Sarah Wilson
                  </Text>
                  <Text style={[styles.reviewDate, { color: colors.placeholder }]}>
                    Sep 12, 2023
                  </Text>
                </View>
              </View>
              <RatingStars rating={4.5} size={16} />
            </View>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              The job description was accurate and the payment was made as agreed. The work environment was safe and well-organized.
            </Text>
          </Card>
        </View>
      )}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.card }]}
          >
            <Edit size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.card }]}
          >
            <Settings size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {userType === 'worker' ? renderWorkerProfile() : renderEmployerProfile()}
        
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={16} color={colors.primary} />}
          style={styles.logoutButton}
          fullWidth
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 30,
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.m,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.s,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    paddingHorizontal: Spacing.l,
    paddingBottom: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.l,
  },
  profileHeaderContent: {
    flex: 1,
    marginRight: Spacing.l,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  companyName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  reviewCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 4,
  },
  bio: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: Spacing.m,
  },
  detailsContainer: {
    marginBottom: Spacing.s,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.s,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: Spacing.xs,
  },
  ratesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  rateItem: {
    alignItems: 'center',
  },
  rateValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
  },
  rateLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  rateDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  skillsContainer: {
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: Spacing.s,
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    marginRight: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: Spacing.l,
  },
  tab: {
    paddingVertical: Spacing.s,
    paddingHorizontal: Spacing.m,
    marginRight: Spacing.m,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  portfolioContainer: {
    marginBottom: Spacing.l,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioItem: {
    width: '48%',
    height: 150,
    marginBottom: Spacing.m,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
  },
  portfolioOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.s,
  },
  portfolioTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  reviewsContainer: {
    marginBottom: Spacing.l,
  },
  reviewCard: {
    marginBottom: Spacing.m,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.s,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUserInfo: {
    marginLeft: Spacing.s,
  },
  reviewUserName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  reviewDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  reviewText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  experienceContainer: {
    marginBottom: Spacing.l,
  },
  experienceCard: {
    marginBottom: Spacing.m,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.s,
  },
  experienceTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  experienceCompany: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  experienceDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  experienceDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: Spacing.s,
  },
  emptyMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.l,
  },
  emptyButton: {
    minWidth: 150,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: Spacing.l,
  },
  statItem: {
    alignItems: 'center',
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginLeft: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  jobStatsContainer: {
    marginBottom: Spacing.l,
  },
  jobStatsCard: {
    padding: Spacing.m,
  },
  jobStatsTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    marginBottom: Spacing.m,
  },
  jobStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  jobStatLabel: {
    width: 90,
  },
  jobStatLabelText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  jobStatBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    marginHorizontal: Spacing.s,
    overflow: 'hidden',
  },
  jobStatFill: {
    height: '100%',
  },
  jobStatValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    width: 30,
    textAlign: 'right',
  },
  logoutButton: {
    marginTop: Spacing.l,
    marginBottom: Spacing.xl,
  },
});