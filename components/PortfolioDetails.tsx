
import React from 'react';
import { StudentPortfolio, Zone, LTC } from '../types';

interface PortfolioDetailsProps {
  portfolio: StudentPortfolio;
  onClose: () => void;
  // Added master data props to fix lookups for dynamic data
  zones: Zone[];
  ltcs: LTC[];
}

const PortfolioDetails: React.FC<PortfolioDetailsProps> = ({ portfolio, onClose, zones, ltcs }) => {
  const zone = zones.find(z => z.id === portfolio.zoneId);
  const ltc = ltcs.find(l => l.id === portfolio.ltcId);

  const getJobReadyLevel = () => {
    let score = 0;
    if (portfolio.documents.aadhaar && portfolio.documents.bankAccount) score += 2;
    if (portfolio.basicComputerKnowledge) score += 1;
    if (portfolio.typingSpeed === '30+') score += 2;
    else if (portfolio.typingSpeed === '20–30') score += 1;
    
    if (score >= 4) return { text: 'JOB READY', color: 'text-green-600', bg: 'bg-green-50', icon: 'fa-star' };
    if (score >= 2) return { text: 'PARTIALLY READY', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-user-check' };
    return { text: 'TRAINING NEEDED', color: 'text-orange-600', bg: 'bg-orange-50', icon: 'fa-graduation-cap' };
  };

  const jr = getJobReadyLevel();

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[60] flex items-center justify-center p-2 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative animate-in slide-in-from-bottom-10 duration-500">
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100 active:scale-90 transition-all z-10"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        <div className="p-8 md:p-12 overflow-y-auto max-h-[95vh] space-y-10 scroll-smooth">
          {/* Top Header Card */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <img 
                src={portfolio.photoUrl} 
                alt={portfolio.fullName} 
                className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-red-50 shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-orange-950 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                 <i className="fas fa-certificate"></i>
              </div>
            </div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">{portfolio.fullName}</h2>
            <p className="text-red-600 font-black text-[10px] uppercase tracking-widest mt-1 mb-4">{portfolio.courseTitle}</p>
            
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-2xl ${jr.bg} ${jr.color} font-black text-xs uppercase shadow-sm border border-current/20`}>
              <i className={`fas ${jr.icon}`}></i>
              {jr.text}
            </div>
          </div>

          {/* Training Center Tagline */}
          <div className="flex flex-col items-center gap-2 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
             <div className="flex items-center gap-6">
               <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Zone</span>
                  <span className="text-sm font-black text-slate-800">{zone?.name || 'Unassigned'}</span>
               </div>
               <div className="h-8 w-px bg-slate-200" />
               <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Training Center (LTC)</span>
                  <span className="text-sm font-black text-slate-800">{ltc?.name || 'Unassigned'}</span>
               </div>
             </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <StatBox icon="fa-phone" label="Mobile" value={portfolio.mobile} />
             <StatBox icon="fa-map-marker-alt" label="District" value={portfolio.district} />
             <StatBox icon="fa-calendar-alt" label="DOB" value={portfolio.dob} />
             <StatBox icon="fa-graduation-cap" label="Education" value={portfolio.educationLevel} />
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8">
            <ProfileSection title="Personal & Contact" icon="fa-user">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Father's Name" value={portfolio.fatherName} />
                <DetailItem label="Gender" value={portfolio.gender} />
                <DetailItem label="Email" value={portfolio.email} />
                <DetailItem label="Home Village" value={portfolio.village} />
                <DetailItem label="Preferred Work Location" value={portfolio.preferredLocation} />
              </div>
            </ProfileSection>

            <ProfileSection title="Education History" icon="fa-university">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailItem label="Institute Name" value={portfolio.instituteName} />
                <DetailItem label="Passing Year" value={portfolio.passingYear} />
                <DetailItem label="Maths Studied" value={portfolio.studiedMaths ? 'Yes' : 'No'} />
                <DetailItem label="English Studied" value={portfolio.studiedEnglish ? 'Yes' : 'No'} />
              </div>
            </ProfileSection>

            <ProfileSection title="Job Skills & Readiness" icon="fa-laptop-code">
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl">
                <SkillIndicator label="Computer Knowledge" active={portfolio.basicComputerKnowledge} />
                <DetailItem label="Typing Speed" value={portfolio.typingSpeed} />
                <DetailItem label="Past Experience" value={portfolio.experience} />
                <DetailItem label="Availability" value={portfolio.availability} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                 {portfolio.softwareKnown.map(sw => (
                   <span key={sw} className="px-3 py-1 bg-white border border-red-100 rounded-xl text-[9px] font-black text-red-600 uppercase">
                     {sw}
                   </span>
                 ))}
              </div>
            </ProfileSection>

            <ProfileSection title="Languages Known" icon="fa-language">
              <div className="flex flex-wrap gap-4">
                 <CheckBadge label="Local Language" active={portfolio.languages.local} />
                 <CheckBadge label="Hindi" active={portfolio.languages.hindi} />
                 <CheckBadge label="English Read" active={portfolio.languages.english.read} />
                 <CheckBadge label="English Write" active={portfolio.languages.english.write} />
                 <CheckBadge label="English Speak" active={portfolio.languages.english.speak} />
              </div>
            </ProfileSection>

            <ProfileSection title="KYC Documents" icon="fa-file-shield">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                 <DocChip label="Aadhaar" active={portfolio.documents.aadhaar} />
                 <DocChip label="Bank Account" active={portfolio.documents.bankAccount} />
                 <DocChip label="Edu Certificate" active={portfolio.documents.educationCertificate} />
              </div>
            </ProfileSection>
          </div>

          <div className="pt-10 flex flex-col gap-3">
            <button className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-red-200 active:scale-95 transition-all">
              Download Profile Card
            </button>
            <p className="text-[9px] text-center text-slate-400 font-black uppercase tracking-widest">Digital Portfolio Verified by Yuva Parivartan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ title, icon, children }: any) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 border-b border-red-50 pb-2">
      <i className={`fas ${icon} text-red-500 text-xs`}></i>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h3>
    </div>
    <div className="px-1">{children}</div>
  </div>
);

const DetailItem = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-[8px] font-black text-slate-300 uppercase">{label}</p>
    <p className="text-xs font-bold text-slate-700">{value || '-'}</p>
  </div>
);

const StatBox = ({ icon, label, value }: any) => (
  <div className="bg-red-50/50 p-4 rounded-3xl flex flex-col items-center text-center gap-1 border border-red-50">
    <i className={`fas ${icon} text-red-400 text-xs mb-1`}></i>
    <p className="text-[7px] font-black text-red-300 uppercase">{label}</p>
    <p className="text-[10px] font-black text-red-900 truncate w-full">{value}</p>
  </div>
);

const SkillIndicator = ({ label, active }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded flex items-center justify-center text-[8px] ${active ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
       <i className={`fas ${active ? 'fa-check' : 'fa-times'}`}></i>
    </div>
    <span className="text-[10px] font-bold text-slate-600 uppercase">{label}</span>
  </div>
);

const CheckBadge = ({ label, active }: any) => (
  <div className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase flex items-center gap-2 border-2 transition-all ${
    active ? 'bg-white border-red-500 text-red-600' : 'bg-slate-50 border-slate-100 text-slate-400'
  }`}>
    <i className={`fas ${active ? 'fa-check-circle' : 'fa-circle'}`}></i>
    {label}
  </div>
);

const DocChip = ({ label, active }: any) => (
  <div className={`px-4 py-3 rounded-2xl flex items-center justify-between border-2 transition-all ${
    active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'
  }`}>
    <span className="text-[9px] font-black uppercase">{label}</span>
    <i className={`fas ${active ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
  </div>
);

export default PortfolioDetails;