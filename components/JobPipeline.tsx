
import React, { useState } from 'react';
import { Company, JobOpening, RecruitmentStatus } from '../types';

interface PipelineProps {
  companies: Company[];
  isAdmin: boolean;
}

const JobPipeline: React.FC<PipelineProps> = ({ companies, isAdmin }) => {
  const [openings, setOpenings] = useState<JobOpening[]>([
    { id: 'j1', companyId: 'c1', title: 'Assembly Line Tech', salary: 18000, openings: 25, status: 'Planned', visitDate: '2024-06-15', mode: 'Onsite' },
    { id: 'j2', companyId: 'c2', title: 'Banking Assistant', salary: 22000, openings: 10, status: 'Interview Ongoing', visitDate: '2024-05-20', mode: 'Hybrid' },
    { id: 'j3', companyId: 'c3', title: 'Retail Associate', salary: 15000, openings: 40, status: 'Offers Released', visitDate: '2024-04-10', mode: 'Onsite' },
  ]);

  const getStatusColor = (status: RecruitmentStatus) => {
    switch (status) {
      case 'Planned': return 'bg-blue-500';
      case 'Interview Ongoing': return 'bg-orange-500';
      case 'Offers Released': return 'bg-emerald-500';
      case 'Joining Completed': return 'bg-slate-800';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Recruitment Pipeline</h2>
          <p className="text-red-600 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Upcoming Visits & Job Openings</p>
        </div>
        {isAdmin && (
          <button className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
            <i className="fas fa-plus mr-2"></i> Add Opening
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {openings.map(job => {
          const company = companies.find(c => c.id === job.companyId);
          return (
            <div key={job.id} className="bg-white rounded-[2.5rem] border border-red-50 shadow-xl overflow-hidden group hover:border-red-200 transition-all">
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-red-50 group-hover:border-red-100 transition-colors">
                        <i className="fas fa-building text-2xl text-slate-400 group-hover:text-red-500"></i>
                     </div>
                     <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${getStatusColor(job.status)} shadow-lg`}>
                        {job.status}
                     </span>
                  </div>

                  <div>
                     <h4 className="text-xl font-black text-slate-800 uppercase">{job.title}</h4>
                     <p className="text-red-600 font-black text-[10px] uppercase tracking-widest mt-1">{company?.name} • {job.mode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                     <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase">Expected Salary</p>
                        <p className="text-sm font-black text-slate-800">₹{job.salary.toLocaleString()}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-300 uppercase">Positions</p>
                        <p className="text-sm font-black text-slate-800">{job.openings} Open</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                     <div className="flex items-center gap-2">
                        <i className="fas fa-calendar-day text-slate-400 text-xs"></i>
                        <span className="text-[10px] font-black text-slate-500 uppercase">{job.visitDate}</span>
                     </div>
                     <button className="text-[10px] font-black text-red-600 uppercase hover:underline">View Details</button>
                  </div>
               </div>
               
               {isAdmin && (
                 <div className="bg-slate-50 px-8 py-4 flex gap-2 border-t border-slate-100">
                    <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:bg-slate-100">Edit</button>
                    <button className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase">Post Candidates</button>
                 </div>
               )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobPipeline;
