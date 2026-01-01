
import React, { useMemo } from 'react';
import { StudentPortfolio, Zone, LTC, DashboardConfig } from '../types';
import { NGO_INFO } from '../constants';

interface DashboardHomeProps {
  portfolios: StudentPortfolio[];
  isAdmin: boolean;
  onNavigate: (view: 'List' | 'Dashboard' | 'Home') => void;
  onAction: (type: 'add_student' | 'add_ltc' | 'reports') => void;
  zones: Zone[];
  ltcs: LTC[];
  config: DashboardConfig;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ portfolios, isAdmin, onNavigate, onAction, zones, ltcs, config }) => {
  
  const stats = useMemo(() => {
    const readiness = { ready: 0, partially: 0, training: 0 };
    const gender = { male: 0, female: 0, other: 0 };

    portfolios.forEach(p => {
      const hasDocuments = p.documents.aadhaar && p.documents.bankAccount;
      const hasComputer = p.basicComputerKnowledge;
      const decentTyping = p.typingSpeed !== 'Below 20 WPM';
      
      if (hasDocuments && hasComputer && decentTyping) readiness.ready++;
      else if (hasDocuments && (hasComputer || decentTyping)) readiness.partially++;
      else readiness.training++;

      if (p.gender === 'Male') gender.male++;
      else if (p.gender === 'Female') gender.female++;
      else gender.other++;
    });

    const districts = new Set(portfolios.map(p => p.district));

    return {
      totalStudents: portfolios.length,
      readiness,
      gender,
      activeDistricts: districts.size,
      totalLTCs: ltcs.length,
      totalZones: zones.length
    };
  }, [portfolios, zones, ltcs]);

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-700">
      
      <section className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-red-100/50 border border-red-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-red-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl shadow-xl shadow-red-200">
             <i className="fas fa-university"></i>
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight">{NGO_INFO.name}</h2>
              <p className="text-red-600 font-black text-sm uppercase tracking-widest mt-1">{NGO_INFO.tagline}</p>
            </div>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{NGO_INFO.mission}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               {NGO_INFO.focusAreas.map(focus => (
                 <span key={focus} className="px-4 py-2 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">{focus}</span>
               ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <ImpactCard icon="fa-users" count={stats.totalStudents} label="Students Enrolled" color="bg-red-600" />
        <ImpactCard icon="fa-layer-group" count={stats.totalZones} label="Operational Zones" color="bg-orange-500" />
        <ImpactCard icon="fa-building-ngo" count={stats.totalLTCs} label="Training Centers" color="bg-indigo-600" />
        {config.showRegionalImpact && <ImpactCard icon="fa-location-dot" count={stats.activeDistricts} label="Districts Reached" color="bg-emerald-600" />}
        {config.showJobReadiness && <ImpactCard icon="fa-user-check" count={stats.readiness.ready} label="Job Ready Trainees" color="bg-green-600" subValue={`${((stats.readiness.ready / (stats.totalStudents || 1)) * 100).toFixed(0)}% Target`} />}
      </section>

      {(config.showJobReadiness || config.showDiversity) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {config.showJobReadiness && (
            <section className="bg-white rounded-[3rem] p-10 border border-red-50 shadow-xl shadow-red-100/30">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Employment Pipeline</h3>
                <i className="fas fa-chart-line text-red-500"></i>
              </div>
              <div className="space-y-6">
                <ProgressBar label="Fully Job Ready" count={stats.readiness.ready} total={stats.totalStudents} color="bg-green-500" description="Aadhaar + Bank + Digital Literacy" />
                <ProgressBar label="Partially Ready" count={stats.readiness.partially} total={stats.totalStudents} color="bg-blue-500" description="Missing key criteria" />
                <ProgressBar label="In Training" count={stats.readiness.training} total={stats.totalStudents} color="bg-orange-500" description="Core vocational skills" />
              </div>
            </section>
          )}

          {config.showDiversity && (
            <section className="bg-white rounded-[3rem] p-10 border border-red-50 shadow-xl shadow-red-100/30">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Diversity & Inclusion</h3>
                <i className="fas fa-venus-mars text-red-500"></i>
              </div>
              <div className="grid grid-cols-3 gap-4 h-full pb-8">
                <DiversityBox icon="fa-person-dress" count={stats.gender.female} label="Female" color="pink" />
                <DiversityBox icon="fa-person" count={stats.gender.male} label="Male" color="blue" />
                <DiversityBox icon="fa-genderless" count={stats.gender.other} label="Others" color="slate" />
              </div>
            </section>
          )}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-red-50 shadow-xl shadow-red-100/20 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 overflow-hidden">
          <div className="w-16 h-12 border-2 border-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
             <i className="fas fa-envelope text-yellow-400"></i>
          </div>
          <div className="text-center sm:text-left min-w-0 overflow-hidden">
            <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Email Address</p>
            <p className="text-lg md:text-xl font-black text-slate-800 mt-1 truncate">{NGO_INFO.email}</p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col justify-center">
           <h3 className="text-2xl font-black text-yellow-400 mb-6">Reach Us</h3>
           <div className="space-y-4">
              {NGO_INFO.phones.map(phone => (
                <div key={phone} className="flex items-center gap-4 group cursor-pointer overflow-hidden">
                   <div className="w-10 h-10 border border-white/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-400 group-hover:border-yellow-400 transition-all flex-shrink-0">
                     <i className="fas fa-phone text-white text-sm group-hover:text-slate-800"></i>
                   </div>
                   <span className="text-lg sm:text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">{phone}</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="bg-slate-900 rounded-[3rem] p-10 shadow-2xl text-white relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-black uppercase tracking-tight">Admin Center</h3>
            <p className="text-slate-400 text-sm font-medium">Manage student records and training centers.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            {isAdmin ? (
              <>
                <ActionButton onClick={() => onAction('add_student')} icon="fa-plus-circle" label="Add Student" primary />
                <ActionButton onClick={() => onAction('add_ltc')} icon="fa-building-circle-check" label="Add LTC" />
              </>
            ) : (
              <div className="col-span-2 text-center py-4 px-8 bg-white/5 rounded-2xl border border-white/10">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator access restricted</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const ImpactCard = ({ icon, count, label, color, subValue }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-red-50 shadow-xl shadow-red-100/20 flex flex-col items-center text-center group hover:translate-y-[-4px] transition-all duration-300">
    <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <p className="text-3xl font-black text-slate-800">{count}</p>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{label}</p>
    {subValue && (
      <span className="mt-2 px-2 py-0.5 bg-green-50 text-green-600 rounded text-[8px] font-black uppercase tracking-tight">{subValue}</span>
    )}
  </div>
);

const DiversityBox = ({ icon, count, label, color }: any) => (
  <div className={`flex flex-col items-center justify-center p-6 bg-${color}-50 rounded-3xl border border-${color}-100`}>
    <i className={`fas ${icon} text-3xl text-${color}-500 mb-4`}></i>
    <span className={`text-2xl font-black text-${color}-600`}>{count}</span>
    <span className={`text-[8px] font-black text-${color}-400 uppercase tracking-widest`}>{label}</span>
  </div>
);

const ProgressBar = ({ label, count, total, color, description }: any) => {
  const percentage = (count / (total || 1)) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</p>
          <p className="text-[8px] font-bold text-slate-400 uppercase">{description}</p>
        </div>
        <div className="text-right">
           <span className="text-sm font-black text-slate-800">{count}</span>
        </div>
      </div>
      <div className="h-2.5 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, primary, onClick }: any) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${primary ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'bg-white/10 text-white'}`}>
    <i className={`fas ${icon} text-sm opacity-80`}></i>
    <span className="whitespace-nowrap">{label}</span>
  </button>
);

export default DashboardHome;
