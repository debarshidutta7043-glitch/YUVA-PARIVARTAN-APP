
import React, { useMemo, useState } from 'react';
import { StudentPortfolio, Zone, LTC, Department } from '../types';

interface PlacementStatsProps {
  portfolios: StudentPortfolio[];
  zones: Zone[];
  ltcs: LTC[];
  departments: Department[];
}

const PlacementStats: React.FC<PlacementStatsProps> = ({ portfolios, zones, ltcs, departments }) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Zones' | 'Companies' | 'Unplaced'>('Overview');

  const stats = useMemo(() => {
    const totalTrained = portfolios.length;
    const placed = portfolios.filter(p => p.placementStatus === 'Placed');
    const unplaced = portfolios.filter(p => p.placementStatus === 'Unplaced');
    const inProcess = portfolios.filter(p => p.placementStatus === 'In Process');
    
    const totalSalary = placed.reduce((acc, curr) => acc + (curr.monthlySalary || 0), 0);
    const avgSalary = placed.length > 0 ? totalSalary / placed.length : 0;
    const maxSalary = Math.max(...placed.map(p => p.monthlySalary || 0), 0);

    const zoneBreakdown = zones.map(z => {
      const trainedInZone = portfolios.filter(p => p.zoneId === z.id).length;
      const placedInZone = placed.filter(p => p.zoneId === z.id).length;
      const salaryInZone = placed.filter(p => p.zoneId === z.id).reduce((acc, curr) => acc + (curr.monthlySalary || 0), 0);
      return {
        ...z,
        trained: trainedInZone,
        placed: placedInZone,
        avgSalary: placedInZone > 0 ? salaryInZone / placedInZone : 0,
        percentage: trainedInZone > 0 ? (placedInZone / trainedInZone) * 100 : 0
      };
    });

    const companiesMap: Record<string, { count: number; salary: number; roles: Set<string> }> = {};
    placed.forEach(p => {
      const co = p.companyName || 'Unknown';
      if (!companiesMap[co]) companiesMap[co] = { count: 0, salary: 0, roles: new Set() };
      companiesMap[co].count++;
      companiesMap[co].salary += p.monthlySalary || 0;
      if (p.jobRole) companiesMap[co].roles.add(p.jobRole);
    });

    const companyStats = Object.entries(companiesMap).map(([name, data]) => ({
      name,
      count: data.count,
      avgSalary: data.salary / data.count,
      roles: Array.from(data.roles)
    })).sort((a, b) => b.count - a.count);

    return {
      totalTrained,
      placedCount: placed.length,
      unplacedCount: unplaced.length,
      inProcessCount: inProcess.length,
      percentage: totalTrained > 0 ? (placed.length / totalTrained) * 100 : 0,
      avgSalary,
      maxSalary,
      zoneBreakdown,
      companyStats,
      unplacedList: unplaced
    };
  }, [portfolios, zones]);

  const downloadCSV = (type: string) => {
    let csvContent = "";
    if (type === 'full') {
      csvContent = "Name,Zone,Status,Company,Salary,Joining Date\n" + 
        portfolios.map(p => `${p.fullName},${zones.find(z => z.id === p.zoneId)?.name},${p.placementStatus},${p.companyName || 'N/A'},${p.monthlySalary || 0},${p.joiningDate || 'N/A'}`).join("\n");
    } else if (type === 'unplaced') {
      csvContent = "Name,Zone,Domain,Reason\n" + 
        stats.unplacedList.map(p => `${p.fullName},${zones.find(z => z.id === p.zoneId)?.name},${departments.find(d => d.id === p.departmentId)?.name},${p.unplacedReason || 'N/A'}`).join("\n");
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `yp_placement_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Placement Statistics</h2>
          <p className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Livelihood Impact Dashboard</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => downloadCSV('full')} className="px-5 py-3 bg-white border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-red-50 transition-all flex items-center gap-2">
             <i className="fas fa-file-csv text-red-500"></i> Full Export
           </button>
           <button onClick={() => window.print()} className="px-5 py-3 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-red-200 active:scale-95 transition-all flex items-center gap-2">
             <i className="fas fa-file-pdf"></i> Summary PDF
           </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Trained" value={stats.totalTrained} icon="fa-user-graduate" color="bg-indigo-600" />
        <MetricCard label="Placed" value={stats.placedCount} sub={`${stats.percentage.toFixed(1)}% Ratio`} icon="fa-briefcase" color="bg-emerald-600" />
        <MetricCard label="Avg Salary" value={`₹${Math.round(stats.avgSalary).toLocaleString()}`} icon="fa-wallet" color="bg-orange-600" />
        <MetricCard label="In Process" value={stats.inProcessCount} icon="fa-spinner" color="bg-blue-600" />
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-3xl border border-red-50 shadow-sm overflow-x-auto no-scrollbar gap-1">
         {(['Overview', 'Zones', 'Companies', 'Unplaced'] as const).map(tab => (
           <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-red-50'}`}>
             {tab}
           </button>
         ))}
      </div>

      {/* Dynamic Content */}
      <div className="bg-white rounded-[3rem] border border-red-50 shadow-xl p-8 md:p-12 overflow-hidden">
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
             <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-800 uppercase">Placement Success</h3>
                <div className="relative h-64 flex items-center justify-center">
                   {/* Custom Pie Chart SVG */}
                   <svg viewBox="0 0 36 36" className="w-56 h-56 transform -rotate-90">
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray={`${stats.percentage} ${100 - stats.percentage}`} />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-emerald-600">{stats.percentage.toFixed(0)}%</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placed</span>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                   <div className="text-center">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mx-auto mb-2" />
                      <p className="text-lg font-black text-slate-800">{stats.placedCount}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Placed</p>
                   </div>
                   <div className="text-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-2" />
                      <p className="text-lg font-black text-slate-800">{stats.inProcessCount}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Awaiting</p>
                   </div>
                   <div className="text-center">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mx-auto mb-2" />
                      <p className="text-lg font-black text-slate-800">{stats.unplacedCount}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase">Needs Aid</p>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
                <h3 className="text-xl font-black text-slate-800 uppercase">Top Hiring Sectors</h3>
                <div className="space-y-4">
                  {departments.map(d => {
                    const deptStudents = portfolios.filter(p => p.departmentId === d.id);
                    const deptPlaced = deptStudents.filter(p => p.placementStatus === 'Placed').length;
                    const p = deptStudents.length > 0 ? (deptPlaced / deptStudents.length) * 100 : 0;
                    return (
                      <div key={d.id} className="group">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-[10px] font-black text-slate-600 uppercase">{d.name}</span>
                          <span className="text-[10px] font-black text-red-600">{deptPlaced} Placed</span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                           <div className={`h-full ${d.color} transition-all duration-1000 group-hover:opacity-80`} style={{ width: `${p}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Zones' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Zone Name</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Trained</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Placed</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Placement %</th>
                  <th className="pb-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Avg Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.zoneBreakdown.map(zb => (
                  <tr key={zb.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-6">
                      <p className="font-black text-slate-800">{zb.name}</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Operational Territory</p>
                    </td>
                    <td className="py-6 text-center font-bold text-slate-600">{zb.trained}</td>
                    <td className="py-6 text-center font-bold text-emerald-600">{zb.placed}</td>
                    <td className="py-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                         <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600" style={{ width: `${zb.percentage}%` }} />
                         </div>
                         <span className="text-[10px] font-black text-slate-800">{zb.percentage.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="py-6 text-right font-black text-slate-800">₹{Math.round(zb.avgSalary).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Companies' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.companyStats.map(co => (
              <div key={co.name} className="p-6 rounded-[2rem] border border-red-50 bg-slate-50/50 hover:bg-white hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-50">
                      <i className="fas fa-building"></i>
                   </div>
                   <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-[9px] font-black uppercase">{co.count} Hired</span>
                </div>
                <h4 className="text-lg font-black text-slate-800 mb-1">{co.name}</h4>
                <div className="flex flex-wrap gap-1 mb-6">
                   {co.roles.map(r => (
                     <span key={r} className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-full">{r}</span>
                   ))}
                </div>
                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                   <span className="text-[9px] font-black text-slate-400 uppercase">Avg Package</span>
                   <span className="text-sm font-black text-slate-800">₹{Math.round(co.avgSalary).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Unplaced' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-rose-50 p-6 rounded-3xl border border-rose-100 mb-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white text-xl">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div>
                    <h4 className="font-black text-rose-900 uppercase">Intervention Required</h4>
                    <p className="text-[10px] font-bold text-rose-600 uppercase">List of students requiring placement assistance</p>
                  </div>
               </div>
               <button onClick={() => downloadCSV('unplaced')} className="px-4 py-2 bg-white text-rose-600 rounded-xl text-[9px] font-black uppercase border border-rose-200">Export List</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {stats.unplacedList.length > 0 ? stats.unplacedList.map(p => (
                 <div key={p.id} className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl group hover:border-red-200 transition-all">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                       <img src={p.photoUrl} className="w-12 h-12 rounded-2xl border-2 border-slate-50" />
                       <div>
                          <p className="font-black text-slate-800">{p.fullName}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{departments.find(d => d.id === p.departmentId)?.name} • {p.district}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[8px] font-black text-slate-300 uppercase">Reason</p>
                          <p className="text-[10px] font-black text-rose-500 uppercase">{p.unplacedReason || 'Awaiting Interview'}</p>
                       </div>
                       <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase active:scale-95">Profile</button>
                    </div>
                 </div>
               )) : (
                 <div className="py-20 text-center space-y-4">
                    <i className="fas fa-check-circle text-4xl text-emerald-100"></i>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Excellent! No unplaced students found.</p>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, sub, icon, color }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-red-50 shadow-xl shadow-red-100/20 flex items-center justify-between group hover:-translate-y-1 transition-all duration-300">
     <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        {sub && <p className="text-[9px] font-black text-emerald-500 uppercase">{sub}</p>}
     </div>
     <div className={`w-14 h-14 ${color} rounded-[1.5rem] flex items-center justify-center text-white text-2xl shadow-lg group-hover:rotate-6 transition-transform`}>
        <i className={`fas ${icon}`}></i>
     </div>
  </div>
);

export default PlacementStats;
