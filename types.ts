
export type Department = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

// Define Role type to resolve import error in App.tsx
export type Role = 'Admin' | 'Viewer';

export type PortfolioStatus = 'Pending' | 'Approved' | 'Rejected';
export type PlacementStatus = 'Placed' | 'Unplaced' | 'In Process';
export type EmploymentType = 'Full-time' | 'Contract' | 'Apprenticeship';
export type SalaryBand = '₹8k–₹12k' | '₹12k–₹18k' | '₹18k+';
export type RecruitmentStatus = 'Planned' | 'Interview Ongoing' | 'Offers Released' | 'Joining Completed';
export type OfferStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Expired';

export interface StudentSkill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Zone {
  id: string;
  name: string;
}

export interface LTC {
  id: string;
  name: string;
  zoneId: string;
}

export interface Company {
  id: string;
  name: string;
  industry: 'IT' | 'Manufacturing' | 'BFSI' | 'Retail' | 'Logistics' | 'Healthcare';
  location: string;
  logo: string;
}

export interface JobOpening {
  id: string;
  companyId: string;
  title: string;
  salary: number;
  openings: number;
  status: RecruitmentStatus;
  visitDate: string;
  mode: 'Onsite' | 'Online' | 'Hybrid';
}

export interface JobOffer {
  id: string;
  studentId: string;
  openingId: string;
  status: OfferStatus;
  timestamp: string;
  digitalConsent?: string;
}

export interface DashboardConfig {
  showJobReadiness: boolean;
  showRegionalImpact: boolean;
  showDiversity: boolean;
  showLtcDistribution: boolean;
  publicVisibility: boolean; // Toggle for what Viewers see
  customTitle: string;
}

export interface StudentPortfolio {
  id: string;
  fullName: string;
  fatherName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  mobile: string;
  email: string;
  village: string;
  district: string;
  state: string;
  preferredLocation: string;
  
  zoneId: string;
  ltcId: string;
  departmentId: string;
  
  courseTitle: string;
  duration: string;
  batchYear: number;
  batchStartDate?: string;
  batchEndDate?: string;
  
  educationLevel: '10th' | '12th' | 'ITI' | 'Diploma' | 'Graduate';
  instituteName: string;
  passingYear: string;

  basicComputerKnowledge: boolean;
  softwareKnown: string[];
  typingSpeed: 'Below 20 WPM' | '20–30' | '30+';

  languages: {
    local: boolean;
    hindi: boolean;
    english: { read: boolean; write: boolean; speak: boolean };
  };

  experience: 'Farm work' | 'Shop helper' | 'Office helper' | 'None';
  documents: {
    aadhaar: boolean;
    bankAccount: boolean;
    educationCertificate: boolean;
  };

  // Placement Data
  placementStatus: PlacementStatus;
  companyName?: string;
  jobRole?: string;
  employmentType?: EmploymentType;
  monthlySalary?: number;
  salaryBand?: SalaryBand;
  unplacedReason?: string;

  bio: string;
  skills: StudentSkill[];
  joinedDate: string;
  photoUrl: string;
  status: PortfolioStatus;
  lastUpdated: string;
}