

import React, { useState, useMemo } from 'react';
import { StudentPortfolio, JobOffer, JobOpening, Company, OfferStatus } from '../types';

interface DigitalOffersProps {
  portfolios: StudentPortfolio[];
  openings: JobOpening[];
  companies: Company[];
  isAdmin: boolean;
  onUpdateOffer?: (offer: JobOffer) => void;
}

const DigitalOffers: React.FC<DigitalOffersProps> = ({ portfolios, openings, companies, isAdmin }) => {
  // Mock Offer Database
  const [offers, setOffers] = useState<JobOffer[]>([
    { id: 'off-1', studentId: 'yp-gen-0', openingId: 'j1', status: 'Pending', timestamp: new Date().toISOString() },
    { id: 'off-2', studentId: 'yp-gen-5', openingId: 'j2', status: 'Accepted', timestamp: new Date().toISOString(), digitalConsent: 'CONSENT_SIGNED_IP_192.168.1.1' },
  ]);

  const handleAction = (offerId: string, status: OfferStatus) => {
    setOffers(prev => prev.map(o => o.id === offerId ? { 
      ...o, 
      status, 
      timestamp: new Date().toISOString(),
      digitalConsent: status === 'Accepted' ? `SIGNED_BY_STUDENT_${new Date().getTime()}` : undefined
    } : o));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Digital Offer System</h2>
          <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mt-1">Verified Livelihood Placement</p>
        </div>
        {isAdmin && (
          <button className="px-6 py-3 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            <i className="fas fa-file-contract mr-2"></i> Issue New Offer
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {offers.map(offer => {
          const student = portfolios.find(p => p.id === offer.studentId);
          const opening = openings.find(o => o.id === offer.openingId);
          const company = companies.find(c => c.id === opening?.companyId);

          if (!student || !opening || !company) return null;

          return (
            <div key={offer.id} className="bg-white rounded-[2.5rem] border border-red-50 p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-emerald-200 transition-all">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 border border-slate-100">
                     <i className="fas fa-file-pdf text-2xl"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        offer.status === 'Accepted' ? 'bg-emerald-100 text-emerald-600' : 
                        offer.status === 'Rejected' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {offer.status}
                      </span>
                      <span className="text-[10px] font-black text-slate-300 uppercase">#{offer.id}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 uppercase">{opening.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">For: {student.fullName} @ {company.name}</p>
                  </div>
               </div>

               <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="text-right hidden md:block">
                     <p className="text-[8px] font-black text-slate-300 uppercase">Last Updated</p>
                     <p className="text-[10px] font-black text-slate-600">{new Date(offer.timestamp).toLocaleString()}</p>
                  </div>
                  
                  <div className="flex gap-2">
                     {offer.status === 'Pending' ? (
                       <>
                          <button onClick={() => handleAction(offer.id, 'Accepted')} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-100">Accept Offer</button>
                          <button onClick={() => handleAction(offer.id, 'Rejected')} className="px-6 py-3 bg-white border border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase">Reject</button>
                       </>
                     ) : (
                       <button className="px-6 py-3 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase cursor-default">
                         {offer.status === 'Accepted' ? 'View Acceptance Certificate' : 'Archived'}
                       </button>
                     )}
                     <button className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                        <i className="fas fa-download"></i>
                     </button>
                  </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Fix: Use dynamic offers.length instead of dead constant for empty state check */}
      {offers.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
           <i className="fas fa-inbox text-4xl text-slate-100 mb-4"></i>
           <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active offers found</p>
        </div>
      )}
    </div>
  );
};

export default DigitalOffers;
