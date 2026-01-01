
import React from 'react';
import { StudentPortfolio, PortfolioStatus, Department, Zone, LTC } from '../types';

interface PortfolioCardProps {
  portfolio: StudentPortfolio;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onClick?: (portfolio: StudentPortfolio) => void;
  isAdminView?: boolean;
  // Added master data props to ensure dynamic updates from admin settings
  departments: Department[];
  zones: Zone[];
  ltcs: LTC[];
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  portfolio, 
  onApprove, 
  onReject, 
  onClick, 
  isAdminView,
  departments,
  zones,
  ltcs
}) => {
  // Use departmentId for lookup instead of non-existent department property
  const deptInfo = departments.find(d => d.id === portfolio.departmentId);
  const zone = zones.find(z => z.id === portfolio.zoneId);
  const ltc = ltcs.find(l => l.id === portfolio.ltcId);

  const getJobReadyStatus = () => {
    const hasDocuments = portfolio.documents.aadhaar && portfolio.documents.bankAccount;
    const hasComputer = portfolio.basicComputerKnowledge;
    const decentTyping = portfolio.typingSpeed !== 'Below 20 WPM';
    
    if (hasDocuments && hasComputer && decentTyping) return { text: 'Job Ready', color: 'bg-green-600' };
    if (hasDocuments && (hasComputer || decentTyping)) return { text: 'Partially Ready', color: 'bg-blue-600' };
    return { text: 'Training Needed', color: 'bg-orange-600' };
  };

  const jrStatus = getJobReadyStatus();

  const getStatusBadge = (status: PortfolioStatus) => {
    switch (status) {
      case 'Approved': return 'bg-green-500 text-white';
      case 'Pending': return 'bg-yellow-400 text-orange-950';
      case 'Rejected': return 'bg-red-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  return (
    <div 
      onClick={() => onClick?.(portfolio)}
      className="bg-white rounded-[2rem] shadow-lg border border-red-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer active:scale-95"
    >
      <div className={`h-2 ${deptInfo?.color || 'bg-red-600'}`} />
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <img 
              src={portfolio.photoUrl} 
              alt={portfolio.fullName} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-white flex items-center justify-center text-[8px] ${deptInfo?.color || 'bg-slate-500'} text-white`}>
              <i className={`fas ${deptInfo?.icon || 'fa-user'}`}></i>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusBadge(portfolio.status)}`}>
               {portfolio.status}
             </span>
             <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest text-white ${jrStatus.color}`}>
               {jrStatus.text}
             </span>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="font-black text-lg text-slate-800 leading-tight">
            {portfolio.fullName}
          </h3>
          <p className="text-[10px] font-bold text-red-600 uppercase mt-1">
            {portfolio.courseTitle}
          </p>
        </div>

        {/* Zone & LTC Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[8px] font-black uppercase border border-slate-200">
            <i className="fas fa-layer-group mr-1"></i> {zone?.name || 'No Zone'}
          </span>
          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[8px] font-black uppercase border border-slate-200">
            <i className="fas fa-building mr-1"></i> {ltc?.name || 'No LTC'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 mb-4">
          <div className="flex items-center gap-1.5">
            <i className="fas fa-map-marker-alt text-[10px]"></i>
            <span className="text-[10px] font-bold">{portfolio.district}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fas fa-graduation-cap text-[10px]"></i>
            <span className="text-[10px] font-bold">{portfolio.educationLevel}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {portfolio.skills.slice(0, 2).map((skill, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 bg-red-50 text-red-700 text-[8px] font-black rounded uppercase"
            >
              {skill.name}
            </span>
          ))}
          {portfolio.skills.length > 2 && (
            <span className="text-[8px] font-black text-slate-300 uppercase">+{portfolio.skills.length - 2}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
           <div className="flex flex-col">
             <span className="text-[8px] font-bold text-slate-300 uppercase">ID No.</span>
             <span className="text-[10px] font-black text-slate-500">YP-{portfolio.id.slice(-5)}</span>
           </div>
           <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5">
             Profile <i className="fas fa-arrow-right"></i>
           </button>
        </div>

        {isAdminView && portfolio.status === 'Pending' && (
          <div className="mt-4 flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onApprove?.(portfolio.id); }}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md active:scale-95"
            >
              Approve
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onReject?.(portfolio.id); }}
              className="px-4 bg-red-50 text-red-500 rounded-xl active:scale-95"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioCard;