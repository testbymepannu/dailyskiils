export type UserType = 'worker' | 'employer' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  profileImage?: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: Date;
}

export interface WorkerProfile extends User {
  userType: 'worker';
  skills: Skill[];
  experience: WorkExperience[];
  hourlyRate: number;
  dailyRate: number;
  availability: Availability;
  languages: string[];
  bio: string;
  verificationStatus: VerificationStatus;
  portfolio: PortfolioItem[];
  rating: number;
  reviewCount: number;
  serviceArea: number; // Radius in km
}

export interface EmployerProfile extends User {
  userType: 'employer';
  companyName?: string;
  rating: number;
  reviewCount: number;
  jobsPosted: number;
  industry?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  isPrimary: boolean;
  yearsExperience: number;
}

export interface WorkExperience {
  id: string;
  title: string;
  company?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
}

export interface Availability {
  weekdays: boolean[];
  startHour: number;
  endHour: number;
  isAvailableNow: boolean;
}

export interface VerificationStatus {
  idVerified: boolean;
  skillsVerified: boolean;
  backgroundChecked: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  date: Date;
  category: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  skills: string[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  budget: {
    minRate: number;
    maxRate: number;
    isHourly: boolean;
  };
  duration: {
    startDate: Date;
    endDate?: Date;
    estimatedHours?: number;
    estimatedDays?: number;
  };
  status: JobStatus;
  employerId: string;
  createdAt: Date;
  applications: JobApplication[];
  isUrgent: boolean;
}

export type JobStatus = 
  | 'open' 
  | 'in-progress' 
  | 'completed' 
  | 'cancelled';

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  proposedRate: number;
  isHourly: boolean;
  coverLetter: string;
  status: ApplicationStatus;
  createdAt: Date;
}

export type ApplicationStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface Review {
  id: string;
  reviewerId: string;
  targetId: string;
  jobId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
  jobId?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}