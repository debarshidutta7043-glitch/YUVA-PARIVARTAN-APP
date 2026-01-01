
export type Department = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type PortfolioStatus = 'Pending' | 'Approved' | 'Rejected';

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

export interface DashboardConfig {
  showJobReadiness: boolean;
  showRegionalImpact: boolean;
  showDiversity: boolean;
  showLtcDistribution: boolean;
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
  departmentId: string; // Changed to ID reference
  
  courseTitle: string;
  duration: string;
  
  educationLevel: '10th' | '12th' | 'ITI' | 'Diploma' | 'Graduate';
  instituteName: string;
  passingYear: string;
  studiedMaths: boolean;
  studiedEnglish: boolean;
  studiedComputers: boolean;

  basicComputerKnowledge: boolean;
  knowsTyping: boolean;
  knowsMouseKeyboard: boolean;
  knowsFileHandling: boolean;
  softwareKnown: string[];
  typingSpeed: 'Below 20 WPM' | '20–30' | '30+';

  languages: {
    local: boolean;
    hindi: boolean;
    english: { read: boolean; write: boolean; speak: boolean };
  };

  experience: 'Farm work' | 'Shop helper' | 'Office helper' | 'None';
  willingToLearn: boolean;
  availability: 'Full-time' | 'Part-time' | 'Shift work';

  documents: {
    aadhaar: boolean;
    bankAccount: boolean;
    educationCertificate: boolean;
  };

  bio: string;
  skills: StudentSkill[];
  joinedDate: string;
  photoUrl: string;
  certificateUrl?: string;
  status: PortfolioStatus;
  lastUpdated: string;
}
