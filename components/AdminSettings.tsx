
import React, { useState } from 'react';
import { Zone, LTC, Department, DashboardConfig } from '../types';

interface AdminSettingsProps {
  zones: Zone[];
  ltcs: LTC[];
  departments: Department[];
  config: DashboardConfig;
  onUpdateZones: (zones: Zone[]) => void;
  onUpdateLTCS: (ltcs: LTC[]) => void;
  onUpdateDepartments: (depts: Department[]) => void;
  onUpdateConfig: (config: DashboardConfig) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ 
  zones, ltcs, departments, config, 
  onUpdateZones, onUpdateLTCS, onUpdateDepartments, onUpdateConfig 
}) => {
  const [activeTab, setActiveTab] = useState<'Infrastructure' | 'Skills' | 'Dashboard'>('Infrastructure');

  const addZone = () => {
    const name = prompt("Enter Zone Name:");
    if (name) onUpdateZones([...zones, { id: `z_${Date.now()}`, name }]);
  };

  const addLTC = () => {
    const name = prompt("Enter LTC Name:");
    const zoneId = prompt("Enter Zone ID (Copy from list below):");
    if (name && zoneId) onUpdateLTCS([...ltcs, { id: `ltc_${Date.now()}`, name, zoneId }]);
  };

  const addDept = () => {
    const name = prompt("Enter Department Name:");
    if (name) onUpdateDepartments([...departments, { 
      id: `d_${Date.now()}`, 
      name, 
      icon: 'fa-briefcase', 
      color: 'bg-slate-600' 
    }]);
  };

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in duration-500">
      <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">System Configuration</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Master Data Control Panel</p>
         </div>
         <div className="flex gap-2">
            <SettingsTab label="Infrastructure" active={activeTab === 'Infrastructure'} onClick={() => setActiveTab('Infrastructure')} />
            <SettingsTab label="Skills" active={activeTab === 'Skills'} onClick={() => setActiveTab('Skills')} />
            <SettingsTab label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
         </div>
      </div>

      <div className="p-10 space-y-10">
        {activeTab === 'Infrastructure' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Zones</h3>
                 <button onClick={addZone} className="text-[10px] font-black text-red-600 uppercase">+ Add Zone</button>
              </div>
              <div className="space-y-2">
                {zones.map(z => (
                  <div key={z.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-sm font-black text-slate-800">{z.name}</p>
                      <p className="text-[8px] font-bold text-slate-400">ID: {z.id}</p>
                    </div>
                    <button onClick={() => onUpdateZones(zones.filter(item => item.id !== z.id))} className="text-slate-300 hover:text-red-500">
                      <i className="fas fa-trash-can text-sm"></i>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Training Centers (LTCs)</h3>
                 <button onClick={addLTC} className="text-[10px] font-black text-red-600 uppercase">+ Add LTC</button>
              </div>
              <div className="space-y-2">
                {ltcs.map(l => {
                  const zone = zones.find(z => z.id === l.zoneId);
                  return (
                    <div key={l.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <p className="text-sm font-black text-slate-800">{l.name}</p>
                        <p className="text-[8px] font-bold text-red-500 uppercase tracking-widest">Zone: {zone?.name || 'Unknown'}</p>
                      </div>
                      <button onClick={() => onUpdateLTCS(ltcs.filter(item => item.id !== l.id))} className="text-slate-300 hover:text-red-500">
                        <i className="fas fa-trash-can text-sm"></i>
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Skills' && (
          <section className="space-y-4 max-w-2xl mx-auto">
             <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Skill Domains / Departments</h3>
                 <button onClick={addDept} className="text-[10px] font-black text-red-600 uppercase">+ Add Domain</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departments.map(d => (
                  <div key={d.id} className="flex items-center gap-4 p-4 bg-white border-2 border-slate-50 rounded-[2rem] shadow-sm hover:border-red-100 transition-all group">
                    <div className={`w-12 h-12 ${d.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                       <i className={`fas ${d.icon}`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-black text-slate-800 truncate">{d.name}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Registered Domain</p>
                    </div>
                    <button onClick={() => onUpdateDepartments(departments.filter(item => item.id !== d.id))} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-600 pr-2">
                       <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))}
              </div>
          </section>
        )}

        {activeTab === 'Dashboard' && (
          <section className="space-y-8 max-w-xl mx-auto py-10">
            <div className="space-y-6">
               <h3 className="text-center text-xl font-black text-slate-800 uppercase tracking-tight">Dashboard Visibility</h3>
               <div className="space-y-4">
                  <ConfigToggle 
                    label="Show Job Readiness Status" 
                    active={config.showJobReadiness} 
                    onToggle={() => onUpdateConfig({...config, showJobReadiness: !config.showJobReadiness})} 
                  />
                  <ConfigToggle 
                    label="Show Regional Reach Metrics" 
                    active={config.showRegionalImpact} 
                    onToggle={() => onUpdateConfig({...config, showRegionalImpact: !config.showRegionalImpact})} 
                  />
                  <ConfigToggle 
                    label="Show Diversity split" 
                    active={config.showDiversity} 
                    onToggle={() => onUpdateConfig({...config, showDiversity: !config.showDiversity})} 
                  />
                  <ConfigToggle 
                    label="Show Detailed LTC Tables" 
                    active={config.showLtcDistribution} 
                    onToggle={() => onUpdateConfig({...config, showLtcDistribution: !config.showLtcDistribution})} 
                  />
               </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const SettingsTab = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active ? 'bg-red-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

const ConfigToggle = ({ label, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
     <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{label}</span>
     <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-green-500' : 'bg-slate-300'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
     </button>
  </div>
);

export default AdminSettings;
