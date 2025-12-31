
import React, { useState, useEffect, useMemo } from 'react';
import { StudentPortfolio, Department } from './types';
import { INITIAL_DATA, DEPARTMENTS, ZONES, LTCS, NGO_INFO } from './constants';
import PortfolioCard from './components/PortfolioCard';
import PortfolioForm from './components/PortfolioForm';
import PortfolioDetails from './components/PortfolioDetails';
import DashboardHome from './components/DashboardHome';

type Role = 'Admin' | 'Viewer';
type ViewMode = 'Home' | 'List' | 'Dashboard';

const App: React.FC = () => {
  const [portfolios, setPortfolios] = useState<StudentPortfolio[]>(INITIAL_DATA);
  const [role, setRole] = useState<Role>('Viewer');
  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<StudentPortfolio | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<StudentPortfolio | null>(null);
  const [activeFilter, setActiveFilter] = useState<Department | 'All'>('All');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [ltcFilter, setLtcFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('Home');

  useEffect(() => {
    const saved = localStorage.getItem('yuvaparivartan_v7');
    if (saved) setPortfolios(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('yuvaparivartan_v7', JSON.stringify(portfolios));
  }, [portfolios]);

  const stats = useMemo(() => {
    const counts = {
      total: portfolios.length,
      jobReady: 0,
      trainingNeeded: 0,
      eduDist: {} as Record<string, number>,
      typingDist: {} as Record<string, number>,
      zoneDist: {} as Record<string, number>,
      ltcDist: {} as Record<string, number>,
      totalZones: ZONES.length,
      totalLTCs: LTCS.length,
    };

    portfolios.forEach(p => {
      const isJobReady = p.documents.aadhaar && p.documents.bankAccount && p.basicComputerKnowledge && p.typingSpeed !== 'Below 20 WPM';
      if (isJobReady) counts.jobReady++;
      else counts.trainingNeeded++;

      counts.eduDist[p.educationLevel] = (counts.eduDist[p.educationLevel] || 0) + 1;
      counts.typingDist[p.typingSpeed] = (counts.typingDist[p.typingSpeed] || 0) + 1;
      
      const zone = ZONES.find(z => z.id === p.zoneId);
      if (zone) counts.zoneDist[zone.name] = (counts.zoneDist[zone.name] || 0) + 1;
      
      const ltc = LTCS.find(l => l.id === p.ltcId);
      if (ltc) counts.ltcDist[ltc.name] = (counts.ltcDist[ltc.name] || 0) + 1;
    });

    return counts;
  }, [portfolios]);

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter(p => {
      const matchesDept = activeFilter === 'All' || p.department === activeFilter;
      const matchesZone = zoneFilter === 'All' || p.zoneId === zoneFilter;
      const matchesLTC = ltcFilter === 'All' || p.ltcId === ltcFilter;
      const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.district.toLowerCase().includes(searchQuery.toLowerCase());
      const isVisible = role === 'Admin' ? true : p.status === 'Approved';
      return matchesDept && matchesZone && matchesLTC && matchesSearch && isVisible;
    });
  }, [portfolios, activeFilter, zoneFilter, ltcFilter, searchQuery, role]);

  const availableLTCsForFilter = useMemo(() => {
    return zoneFilter === 'All' ? LTCS : LTCS.filter(l => l.zoneId === zoneFilter);
  }, [zoneFilter]);

  const handleCreateOrUpdate = (data: any) => {
    if (editingPortfolio) {
      setPortfolios(prev => prev.map(p => p.id === editingPortfolio.id ? { ...p, ...data, lastUpdated: new Date().toISOString() } : p));
      setEditingPortfolio(null);
    } else {
      const newPortfolio: StudentPortfolio = { 
        ...data, 
        id: `yp-${Date.now()}`, 
        status: 'Pending', 
        joinedDate: new Date().toISOString(), 
        lastUpdated: new Date().toISOString() 
      };
      setPortfolios(prev => [newPortfolio, ...prev]);
    }
    setShowForm(false);
  };

  const isAdmin = role === 'Admin';

  return (
    <div className="min-h-screen bg-red-50/30 selection:bg-red-100">
      {/* App Header */}
      <header className="bg-white border-b border-red-100 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('Home')}>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
              <i className="fas fa-university text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 leading-none uppercase">{NGO_INFO.name}</h1>
              <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em] mt-1">Impact Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setRole('Viewer')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'Viewer' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}
              >
                Viewer
              </button>
              <button 
                onClick={() => setRole('Admin')}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'Admin' ? 'bg-red-600 shadow-md text-white' : 'text-slate-400'}`}
              >
                Admin
              </button>
            </div>
            {isAdmin && (
              <button 
                onClick={() => { setEditingPortfolio(null); setShowForm(true); }}
                className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
              >
                New Entry
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Main Tab Navigation */}
        <div className="flex gap-1 mb-10 bg-white p-1.5 rounded-2xl border border-red-100 shadow-sm inline-flex">
          <NavTab label="Home" active={viewMode === 'Home'} onClick={() => setViewMode('Home')} icon="fa-house" />
          <NavTab label="Student Records" active={viewMode === 'List'} onClick={() => setViewMode('List')} icon="fa-users" />
          {isAdmin && <NavTab label="Analytics" active={viewMode === 'Dashboard'} onClick={() => setViewMode('Dashboard')} icon="fa-chart-pie" />}
        </div>

        {viewMode === 'Home' && (
          <DashboardHome 
            portfolios={portfolios} 
            isAdmin={isAdmin} 
            onNavigate={(v) => setViewMode(v)}
            onAction={(type) => {
               if (type === 'add_student') { setEditingPortfolio(null); setShowForm(true); }
               else if (type === 'add_ltc') alert("Feature coming soon: Training Center Config");
               else if (type === 'reports') alert("Feature coming soon: Automated Impact PDF");
            }}
          />
        )}

        {viewMode === 'List' && (
          <div className="animate-in slide-in-from-bottom-6 duration-500">
            {/* Search & Hierarchy Filter Area */}
            <div className="space-y-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative group">
                  <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-red-300"></i>
                  <input 
                    type="text" 
                    placeholder="Search by name or district..." 
                    className="w-full pl-14 pr-6 py-4 bg-white border-2 border-red-50 rounded-2xl outline-none focus:border-red-500 shadow-lg shadow-red-100/30 font-bold"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative">
                  <select 
                    className="w-full px-5 py-4 bg-white border-2 border-red-50 rounded-2xl outline-none appearance-none font-bold text-slate-600 focus:border-red-500 shadow-sm"
                    value={zoneFilter}
                    onChange={e => {
                      setZoneFilter(e.target.value);
                      setLtcFilter('All');
                    }}
                  >
                    <option value="All">All Master Zones</option>
                    {ZONES.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
                </div>

                <div className="relative">
                  <select 
                    className="w-full px-5 py-4 bg-white border-2 border-red-50 rounded-2xl outline-none appearance-none font-bold text-slate-600 focus:border-red-500 shadow-sm"
                    value={ltcFilter}
                    onChange={e => setLtcFilter(e.target.value)}
                  >
                    <option value="All">All Training Centers</option>
                    {availableLTCsForFilter.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
                </div>
              </div>

              <div className="flex overflow-x-auto pb-4 no-scrollbar gap-3 -mx-4 px-4">
                <button 
                  onClick={() => setActiveFilter('All')}
                  className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                    activeFilter === 'All' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white text-slate-400 border-red-50'
                  }`}
                >
                  All Skills
                </button>
                {DEPARTMENTS.map(dept => (
                  <button 
                    key={dept.name}
                    onClick={() => setActiveFilter(dept.name)}
                    className={`whitespace-nowrap px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center gap-2 ${
                      activeFilter === dept.name ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white text-slate-400 border-red-50'
                    }`}
                  >
                    <i className={`fas ${dept.icon}`}></i> {dept.name}
                  </button>
                ))}
              </div>
            </div>

            {/* List Grid */}
            {filteredPortfolios.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPortfolios.map(p => (
                  <div key={p.id} className="relative group">
                    <PortfolioCard 
                      portfolio={p} 
                      isAdminView={isAdmin}
                      onClick={setSelectedPortfolio}
                      onApprove={(id) => setPortfolios(prev => prev.map(item => item.id === id ? {...item, status: 'Approved'} : item))}
                      onReject={(id) => setPortfolios(prev => prev.map(item => item.id === id ? {...item, status: 'Rejected'} : item))}
                    />
                    {isAdmin && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingPortfolio(p); setShowForm(true); }}
                        className="absolute top-4 right-20 w-8 h-8 bg-white/90 backdrop-blur rounded-lg text-slate-400 hover:text-red-600 transition-colors shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100"
                        title="Edit / Reassign"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-white rounded-[3rem] shadow-sm border border-red-50">
                <i className="fas fa-search-minus text-4xl text-red-100 mb-4"></i>
                <h3 className="text-xl font-black text-slate-800">No Student Records Found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your filters.</p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'Dashboard' && isAdmin && (
          /* Hierarchy Dashboard View */
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Impact Analytics</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard label="Total Students" value={stats.total} icon="fa-users" color="bg-red-600" />
              <DashboardCard label="Operational Zones" value={stats.totalZones} icon="fa-globe" color="bg-orange-600" />
              <DashboardCard label="Training Centers" value={stats.totalLTCs} icon="fa-building" color="bg-blue-600" />
              <DashboardCard label="Job Ready Talent" value={stats.jobReady} icon="fa-user-graduate" color="bg-green-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Enrollment per Zone</h4>
                  <div className="space-y-4">
                    {ZONES.map(z => {
                      const count = stats.zoneDist[z.name] || 0;
                      return (
                        <div key={z.id} className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                             <span>{z.name}</span>
                             <span className="text-red-500">{count} Students</span>
                          </div>
                          <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                             <div className="h-full bg-red-500 rounded-full" style={{ width: `${(count / (stats.total || 1)) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
               <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Enrollment per Center (LTC)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {LTCS.map(l => {
                      const count = stats.ltcDist[l.name] || 0;
                      return (
                        <div key={l.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <span className="text-[10px] font-black text-slate-800">{l.name}</span>
                           <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black">{count}</span>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <PortfolioForm 
          initialData={editingPortfolio || undefined}
          onClose={() => { setShowForm(false); setEditingPortfolio(null); }} 
          onSubmit={handleCreateOrUpdate} 
        />
      )}

      {selectedPortfolio && (
        <PortfolioDetails 
          portfolio={selectedPortfolio} 
          onClose={() => setSelectedPortfolio(null)} 
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

const NavTab = ({ label, active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
      active ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    <i className={`fas ${icon} opacity-70`}></i>
    {label}
  </button>
);

const DashboardCard = ({ label, value, icon, color }: any) => (
  <div className={`${color} p-8 rounded-[2.5rem] text-white shadow-xl shadow-current/20 flex items-center justify-between transition-all hover:translate-y-[-4px]`}>
     <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{label}</p>
        <p className="text-4xl font-black">{value}</p>
     </div>
     <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl">
        <i className={`fas ${icon}`}></i>
     </div>
  </div>
);

export default App;
