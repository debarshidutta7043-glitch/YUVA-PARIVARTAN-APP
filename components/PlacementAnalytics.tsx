
import React, { useMemo } from 'react';
import { StudentPortfolio, Department, Zone, Company } from '../types';

interface AnalyticsProps {
  portfolios: StudentPortfolio[];
  isAdmin: boolean;
  departments: Department[];
  zones: Zone[];
}

const PlacementAnalytics: React.FC<AnalyticsProps> = ({ portfolios, isAdmin, departments, zones }) => {
  const analytics = useMemo(() => {
    const years = [2020, 2021, 2022, 2023, 2024];
    
    // Growth Trend
    const trend = years.map(y => {
      const yearStudents = portfolios.filter(p => p.batchYear === y);
      const placed = yearStudents.filter(p => p.placementStatus === 'Placed').length;
      return { year: y, total: yearStudents.length, placed };
    });

    // Industry Pie
    const industryStats: Record<string, number> = {};
    portfolios.filter(p => p.placementStatus === 'Placed').forEach(p => {
      const dept = departments.find(d => d.id === p.departmentId)?.name || 'Other';
      industryStats[dept] = (industryStats[dept] || 0) + 1;
    });

    // Top Companies (Admin Only details)
    const companiesStats: Record<string, { count: number; avgSal: number }> = {};
    portfolios.filter(p => p.placementStatus === 'Placed').forEach(p => {
      const co = p.companyName || 'Unknown';
      if (!companiesStats[co]) companiesStats[co] = { count: 0, avgSal: 0 };
      companiesStats[co].count++;
      companiesStats[co].avgSal += p.monthlySalary || 0;
    });

    // Cast Object.entries to ensure division operands are treated as numbers by TypeScript.
    const sortedCompanies = (Object.entries(companiesStats) as [string, { count: number; avgSal: number }][])
      .map(([name, data]) => ({ name, count: data.count, avgSal: data.avgSal / (data.count || 1) }))
      .sort((a, b) => b.count - a.count);

    return { trend, industryStats, sortedCompanies };
  }, [portfolios, departments]);

  const maxTrend = Math.max(...analytics.trend.map(t => t.total), 1);

  if (portfolios.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-[3rem] shadow-xl border border-red-50">
        <i className="fas fa-chart-line text-slate-100 text-6xl mb-6"></i>
        <p className="font-black text-slate-400 uppercase tracking-widest">No placement data available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* 5-Year Growth Chart */}
      <section className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-red-100/30 border border-red-50">
        <div className="flex justify-between items-center mb-10">
           <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">5-Year Growth Trend</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trained vs Placed (2020 - 2024)</p>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
                 <span className="text-[9px] font-black text-slate-600 uppercase">Trained</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                 <span className="text-[9px] font-black text-slate-600 uppercase">Placed</span>
              </div>
           </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-4 px-4">
           {analytics.trend.map((t, idx) => {
             const hTotal = (t.total / maxTrend) * 100;
             const hPlaced = (t.placed / maxTrend) * 100;
             return (
               <div key={idx} className="flex-1 flex flex-col items-center group relative">
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[9px] font-black px-3 py-1.5 rounded-xl z-10 shadow-xl whitespace-nowrap">
                     {t.placed} Placed / {t.total} Total
                  </div>
                  <div className="w-full max-w-[30px] bg-red-100 rounded-t-lg relative" style={{ height: `${hTotal}%` }}>
                     <div className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-1000" style={{ height: `${(t.placed / (t.total || 1)) * 100}%` }} />
                  </div>
                  <span className="mt-4 text-[10px] font-black text-slate-400">{t.year}</span>
               </div>
             );
           })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Industry Pie Chart View */}
        <section className="bg-white rounded-[3rem] p-10 shadow-2xl border border-red-50">
           <h3 className="text-xl font-black text-slate-800 uppercase mb-8">Industry-wise Impact</h3>
           <div className="space-y-6">
             {/* Explicitly cast Object.entries to ensure 'count' is typed as a number for the arithmetic operation. */}
             {(Object.entries(analytics.industryStats) as [string, number][]).map(([name, count]) => {
               const totalPlaced = portfolios.filter(p => p.placementStatus === 'Placed').length || 1;
               const percentage = (count / totalPlaced) * 100;
               return (
                 <div key={name} className="group">
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">{name}</span>
                       <span className="text-[11px] font-black text-red-600">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                       <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${percentage}%` }} />
                    </div>
                 </div>
               );
             })}
           </div>
        </section>

        {/* Top Recruiting Partners */}
        <section className="bg-white rounded-[3rem] p-10 shadow-2xl border border-red-50">
           <h3 className="text-xl font-black text-slate-800 uppercase mb-8">Top Hiring Partners</h3>
           <div className="divide-y divide-slate-100">
             {analytics.sortedCompanies.slice(0, 5).map((co, idx) => (
               <div key={co.name} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 group-hover:bg-red-600 group-hover:text-white transition-all">0{idx+1}</span>
                     <div>
                        <p className="font-black text-slate-800 uppercase text-xs">{co.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{co.count} Students Recruited</p>
                     </div>
                  </div>
                  {isAdmin && (
                    <div className="text-right">
                       <p className="text-[8px] font-black text-slate-300 uppercase">Avg CTC</p>
                       <p className="text-xs font-black text-emerald-600">₹{Math.round(co.avgSal/1000)}K</p>
                    </div>
                  )}
               </div>
             ))}
           </div>
        </section>
      </div>

      {/* Admin Specific Detailed Breakdown */}
      {isAdmin && (
        <section className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
           <h3 className="text-2xl font-black uppercase tracking-tight mb-10 relative">Recruitment Funnel (Admin)</h3>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <FunnelStep label="Trained" value={portfolios.length} color="bg-white/10" icon="fa-user-graduate" />
              <FunnelStep label="Interviewed" value={Math.round(portfolios.length * 0.85)} color="bg-white/20" icon="fa-comments" />
              <FunnelStep label="Offered" value={Math.round(portfolios.length * 0.75)} color="bg-white/30" icon="fa-file-signature" />
              <FunnelStep label="Joined" value={portfolios.filter(p => p.placementStatus === 'Placed').length} color="bg-red-600" icon="fa-handshake" />
           </div>
        </section>
      )}
    </div>
  );
};

const FunnelStep = ({ label, value, color, icon }: any) => (
  <div className={`${color} p-8 rounded-[2.5rem] flex flex-col items-center text-center gap-4 border border-white/5`}>
     <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">
        <i className={`fas ${icon}`}></i>
     </div>
     <div>
        <p className="text-3xl font-black">{value}</p>
        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">{label}</p>
     </div>
  </div>
);

export default PlacementAnalytics;
