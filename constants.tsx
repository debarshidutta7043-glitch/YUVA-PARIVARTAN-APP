
import { Department, Zone, LTC, DashboardConfig, StudentPortfolio, Company, JobOpening } from './types';

export const NGO_INFO = {
  name: 'YUVA PARIVARTAN',
  tagline: 'Inspiring youth to participate in the process of transformation.',
  mission: 'To provide livelihood skills to rural and urban underprivileged youth who have dropped out of school.',
  established: '1998',
  email: 'info@yuvaparivartan.org',
  phones: ['+91 8828170103', '+91 8828059189'],
  focusAreas: ['Skill Development', 'Livelihood Training', 'Youth Empowerment']
};

export const INITIAL_DASHBOARD_CONFIG: DashboardConfig = {
  showJobReadiness: true,
  showRegionalImpact: true,
  showDiversity: true,
  showLtcDistribution: true,
  publicVisibility: true,
  customTitle: 'Yuva Parivartan Impact'
};

export const ZONES: Zone[] = [
  { id: 'z_west', name: 'West Zone' },
  { id: 'z_north', name: 'North Zone' },
  { id: 'z_south', name: 'South Zone' },
  { id: 'z_east', name: 'East Zone' },
];

export const LTCS: LTC[] = [
  { id: 'ltc_mumbai', name: 'Mumbai Hub', zoneId: 'z_west' },
  { id: 'ltc_pune', name: 'Pune Center', zoneId: 'z_west' },
  { id: 'ltc_delhi', name: 'Delhi Regional', zoneId: 'z_north' },
  { id: 'ltc_lucknow', name: 'Lucknow Center', zoneId: 'z_north' },
  { id: 'ltc_bangalore', name: 'Bangalore Hub', zoneId: 'z_south' },
];

export const DEPARTMENTS: Department[] = [
  { id: 'd_it', name: 'IT & Data Ops', icon: 'fa-laptop-code', color: 'bg-blue-600' },
  { id: 'd_mfg', name: 'Manufacturing', icon: 'fa-industry', color: 'bg-orange-600' },
  { id: 'd_retail', name: 'Retail & Sales', icon: 'fa-shop', color: 'bg-pink-600' },
  { id: 'd_bfsi', name: 'BFSI (Banking)', icon: 'fa-building-columns', color: 'bg-indigo-600' },
  { id: 'd_health', name: 'Healthcare', icon: 'fa-heart-pulse', color: 'bg-red-500' },
];

export const MOCK_COMPANIES: Company[] = [
  { id: 'c1', name: 'Tata Motors', industry: 'Manufacturing', location: 'Pune', logo: '' },
  { id: 'c2', name: 'HDFC Bank', industry: 'BFSI', location: 'Mumbai', logo: '' },
  { id: 'c3', name: 'Reliance Retail', industry: 'Retail', location: 'Navi Mumbai', logo: '' },
  { id: 'c4', name: 'Amazon Logistics', industry: 'Logistics', location: 'Bangalore', logo: '' },
  { id: 'c5', name: 'Apollo Hospitals', industry: 'Healthcare', location: 'Delhi', logo: '' },
  { id: 'c6', name: 'Infosys', industry: 'IT', location: 'Mysore', logo: '' },
];

// Generator for 200+ records
export const generateMassData = (): StudentPortfolio[] => {
  const students: StudentPortfolio[] = [];
  const firstNames = ['Arjun', 'Priya', 'Rohan', 'Sneha', 'Vikram', 'Anjali', 'Deepak', 'Kavita', 'Sanjay', 'Meera'];
  const lastNames = ['Mehra', 'Sharma', 'Deshmukh', 'Patel', 'Yadav', 'Singh', 'Kulkarni', 'Joshi', 'Verma', 'Khan'];
  
  for (let i = 0; i < 220; i++) {
    const year = 2020 + (i % 5); // 2020 to 2024
    const isPlaced = Math.random() > 0.3; // 70% placement rate
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const company = MOCK_COMPANIES[i % MOCK_COMPANIES.length];
    const zone = ZONES[i % ZONES.length];
    const ltc = LTCS.find(l => l.zoneId === zone.id) || LTCS[0];

    students.push({
      id: `yp-gen-${i}`,
      fullName: `${firstNames[i % 10]} ${lastNames[Math.floor(i / 10) % 10]}`,
      fatherName: 'Parent Name',
      dob: '2001-01-01',
      gender: i % 2 === 0 ? 'Male' : 'Female',
      mobile: `9800000${i.toString().padStart(3, '0')}`,
      email: `student${i}@yuvaparivartan.com`,
      village: 'Gram Vikas',
      district: 'District A',
      state: 'Maharashtra',
      preferredLocation: 'Metro City',
      zoneId: zone.id,
      ltcId: ltc.id,
      departmentId: dept.id,
      courseTitle: `${dept.name} Professional`,
      duration: '3 Months',
      batchYear: year,
      educationLevel: '12th',
      instituteName: 'Rural College',
      passingYear: (year - 1).toString(),
      basicComputerKnowledge: true,
      softwareKnown: ['Excel', 'Word'],
      typingSpeed: '20–30',
      languages: { local: true, hindi: true, english: { read: true, write: true, speak: false } },
      experience: 'None',
      documents: { aadhaar: true, bankAccount: true, educationCertificate: true },
      placementStatus: isPlaced ? 'Placed' : (i % 10 === 0 ? 'In Process' : 'Unplaced'),
      companyName: isPlaced ? company.name : undefined,
      jobRole: isPlaced ? 'Assistant' : undefined,
      employmentType: 'Full-time',
      monthlySalary: isPlaced ? (10000 + (Math.random() * 15000)) : 0,
      salaryBand: isPlaced ? '₹12k–₹18k' : '₹8k–₹12k',
      bio: 'Ready to contribute and learn.',
      skills: [{ name: 'Punctuality', level: 'Advanced' }],
      joinedDate: `${year}-01-15`,
      photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=YP${i}`,
      status: 'Approved',
      lastUpdated: '2024-03-01'
    });
  }
  return students;
};

export const INITIAL_STUDENTS: StudentPortfolio[] = generateMassData();
