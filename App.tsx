
import React, { useState, useEffect, useMemo } from 'react';
import { StudentPortfolio, Department, Zone, LTC, DashboardConfig, Role, Company } from './types';
import { NGO_INFO, ZONES, LTCS, DEPARTMENTS, INITIAL_DASHBOARD_CONFIG, INITIAL_STUDENTS, MOCK_COMPANIES } from './constants';
import PortfolioCard from './components/PortfolioCard';
import PortfolioForm from './components/PortfolioForm';
import PortfolioDetails from './components/PortfolioDetails';
import DashboardHome from './components/DashboardHome';
import AdminSettings from './components/AdminSettings';
import PlacementStats from './components/PlacementStats';
import PlacementAnalytics from './components/PlacementAnalytics';
import JobPipeline from './components/JobPipeline';

type ViewMode = 'Home' | 'List' | 'Dashboard' | 'Settings' | 'Placements' | 'Analytics' | 'Pipeline';

const App: React.FC = () => {
  const [zones, setZones] = useState<Zone[]>(ZONES);
  const [ltcs, setLtcs] = useState<LTC[]>(LTCS);
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [dbConfig, setDbConfig] = useState<DashboardConfig>(INITIAL_DASHBOARD_CONFIG);
  const [portfolios, setPortfolios] = useState<StudentPortfolio[]>([]);
  const [companies] = useState<Company[]>(MOCK_COMPANIES);

  // Utilize the Role type imported from types.ts
  const [role, setRole] = useState<Role>('Viewer');
  const [showForm, setShowForm] = useState(false);
  const [editingPortfolio, setEditingPortfolio] = useState<StudentPortfolio | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<StudentPortfolio | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [zoneFilter, setZoneFilter] = useState<string>('All');
  const [ltcFilter, setLtcFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('Home');

  useEffect(() => {
    const saved = localStorage.getItem('yp_master_v4');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.zones) setZones(parsed.zones);
      if (parsed.ltcs) setLtcs(parsed.ltcs);
      if (parsed.departments) setDepartments(parsed.departments);
      if (parsed.dbConfig) setDbConfig(parsed.dbConfig);
      if (parsed.portfolios && parsed.portfolios.length > 0) {
        setPortfolios(parsed.portfolios);
      } else {
        setPortfolios(INITIAL_STUDENTS);
      }
    } else {
      setPortfolios(INITIAL_STUDENTS);
    }
  }, []);

  useEffect(() => {
    const payload = { zones, ltcs, departments, dbConfig, portfolios };
    localStorage.setItem('yp_master_v4', JSON.stringify(payload));
  }, [zones, ltcs, departments, dbConfig, portfolios]);

  const filteredPortfolios = useMemo(() => {
    return portfolios.filter(p => {
      const matchesDept = activeFilter === 'All' || p.departmentId === activeFilter;
      const matchesZone = zoneFilter === 'All' || p.zoneId === zoneFilter;
      const matchesLTC = ltcFilter === 'All' || p.ltcId === ltcFilter;
      const matchesSearch = p.fullName.toLowerCase().includes(searchQuery.toLowerCase());
      const isVisible = role === 'Admin' ? true : p.status === 'Approved';
      return matchesDept && matchesZone && matchesLTC && matchesSearch && isVisible;
    });
  }, [portfolios, activeFilter, zoneFilter, ltcFilter, searchQuery, role]);

  const isAdmin = role === 'Admin';

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

  return (
    <div className="min-h-screen bg-red-50/30 selection:bg-red-100">
      <header className="bg-white border-b border-red-100 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewMode('Home')}>
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-100">
              <i className="fas fa-university text-lg"></i>
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800 leading-none uppercase">{NGO_INFO.name}</h1>
              <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em] mt-1">Livelihood Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button onClick={() => setRole('Viewer')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'Viewer' ? 'bg-white shadow-sm text-red-600' : 'text-slate-400'}`}>Viewer</button>
              <button onClick={() => setRole('Admin')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${role === 'Admin' ? 'bg-red-600 shadow-md text-white' : 'text-slate-400'}`}>Admin</button>
            </div>
            {isAdmin && (
              <button onClick={() => { setEditingPortfolio(null); setShowForm(true); }} className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">New Entry</button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Navigation */}
        <div className="flex gap-1 mb-10 bg-white p-1.5 rounded-2xl border border-red-100 shadow-sm inline-flex overflow-x-auto no-scrollbar max-w-full">
          <NavTab label="Home" active={viewMode === 'Home'} onClick={() => setViewMode('Home')} icon="fa-house" />
          <NavTab label="Trainees" active={viewMode === 'List'} onClick={() => setViewMode('List')} icon="fa-users" />
          <NavTab label="Analytics" active={viewMode === 'Analytics'} onClick={() => setViewMode('Analytics')} icon="fa-chart-pie" />
          {isAdmin && <NavTab label="Recruitment" active={viewMode === 'Pipeline'} onClick={() => setViewMode('Pipeline')} icon="fa-briefcase" />}
          {isAdmin && <NavTab label="System Config" active={viewMode === 'Settings'} onClick={() => setViewMode('Settings')} icon="fa-gears" />}
        </div>

        {viewMode === 'Home' && (
          <DashboardHome 
            portfolios={portfolios} 
            isAdmin={isAdmin} 
            onNavigate={(v) => setViewMode(v)}
            zones={zones}
            ltcs={ltcs}
            config={dbConfig}
            onAction={(type) => {
               if (type === 'add_student') { setEditingPortfolio(null); setShowForm(true); }
               else if (type === 'add_ltc') setViewMode('Settings');
               else if (type === 'reports') setViewMode('Analytics');
            }}
          />
        )}

        {viewMode === 'Analytics' && (
          <PlacementAnalytics portfolios={portfolios} isAdmin={isAdmin} departments={departments} zones={zones} />
        )}

        {viewMode === 'Pipeline' && isAdmin && (
          <JobPipeline companies={companies} isAdmin={isAdmin} />
        )}

        {viewMode === 'Settings' && isAdmin && (
          <AdminSettings 
            zones={zones} 
            ltcs={ltcs} 
            departments={departments} 
            config={dbConfig}
            onUpdateZones={setZones}
            onUpdateLTCS={setLtcs}
            onUpdateDepartments={setDepartments}
            onUpdateConfig={setDbConfig}
          />
        )}

        {viewMode === 'List' && (
          <div className="animate-in slide-in-from-bottom-6 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
               <div className="md:col-span-2 relative">
                  <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-red-300"></i>
                  <input type="text" placeholder="Search by name..." className="w-full pl-14 pr-6 py-4 bg-white border-2 border-red-50 rounded-2xl outline-none focus:border-red-500 shadow-lg shadow-red-100/30 font-bold" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
               </div>
               <SelectFilter value={zoneFilter} onChange={setZoneFilter} options={zones} label="All Zones" />
               <SelectFilter value={ltcFilter} onChange={setLtcFilter} options={ltcs.filter(l => zoneFilter === 'All' || l.zoneId === zoneFilter)} label="All Centers" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredPortfolios.map(p => (
                 <PortfolioCard 
                   key={p.id} 
                   portfolio={p} 
                   isAdminView={isAdmin} 
                   onClick={setSelectedPortfolio} 
                   departments={departments}
                   zones={zones}
                   ltcs={ltcs}
                 />
               ))}
            </div>
          </div>
        )}
      </main>

      {showForm && (
        <PortfolioForm 
          zones={zones} 
          ltcs={ltcs} 
          departments={departments}
          initialData={editingPortfolio || undefined}
          onClose={() => { setShowForm(false); setEditingPortfolio(null); }} 
          onSubmit={handleCreateOrUpdate} 
        />
      )}

      {selectedPortfolio && (
        <PortfolioDetails 
          portfolio={selectedPortfolio} 
          onClose={() => setSelectedPortfolio(null)} 
          zones={zones} 
          ltcs={ltcs} 
        />
      )}
    </div>
  );
};

const NavTab = ({ label, active, onClick, icon }: any) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${active ? 'bg-red-600 text-white shadow-xl shadow-red-200' : 'text-slate-400 hover:text-slate-600'}`}>
    <i className={`fas ${icon} opacity-70`}></i> {label}
  </button>
);

const SelectFilter = ({ value, onChange, options, label }: any) => (
  <div className="relative">
    <select className="w-full px-5 py-4 bg-white border-2 border-red-50 rounded-2xl outline-none appearance-none font-bold text-slate-600 focus:border-red-500 shadow-sm" value={value} onChange={e => onChange(e.target.value)}>
      <option value="All">{label}</option>
      {options.map((o: any) => <option key={o.id} value={o.id}>{o.name}</option>)}
    </select>
    <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
  </div>
);

export default App;