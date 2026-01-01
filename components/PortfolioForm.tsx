
import React, { useState, useRef, useMemo } from 'react';
import { Department, StudentPortfolio, StudentSkill, Zone, LTC } from '../types';
import { generateProfessionalBio } from '../services/gemini';

interface PortfolioFormProps {
  onSubmit: (data: Omit<StudentPortfolio, 'id' | 'status' | 'joinedDate' | 'lastUpdated'>) => void;
  onClose: () => void;
  initialData?: StudentPortfolio;
  // Added master data props to define available options
  zones: Zone[];
  ltcs: LTC[];
  departments: Department[];
}

const PortfolioForm: React.FC<PortfolioFormProps> = ({ onSubmit, onClose, initialData, zones, ltcs, departments }) => {
  const [step, setStep] = useState(1);
  const photoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<any>(initialData ? { ...initialData } : {
    fullName: '',
    fatherName: '',
    dob: '',
    gender: 'Male',
    mobile: '',
    email: '',
    village: '',
    district: '',
    state: '',
    preferredLocation: '',
    zoneId: '',
    ltcId: '',
    // Use departmentId instead of department name string
    departmentId: departments[0]?.id || '',
    courseTitle: '',
    duration: '',
    educationLevel: '10th',
    instituteName: '',
    passingYear: '',
    studiedMaths: false,
    studiedEnglish: false,
    studiedComputers: false,
    basicComputerKnowledge: false,
    knowsTyping: false,
    knowsMouseKeyboard: false,
    knowsFileHandling: false,
    softwareKnown: [] as string[],
    typingSpeed: 'Below 20 WPM',
    languages: { local: true, hindi: true, english: { read: false, write: false, speak: false } },
    experience: 'None',
    willingToLearn: true,
    availability: 'Full-time',
    documents: { aadhaar: false, bankAccount: false, educationCertificate: false },
    bio: '',
    photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    certificateUrl: ''
  });

  const filteredLTCs = useMemo(() => {
    return ltcs.filter(ltc => ltc.zoneId === formData.zoneId);
  }, [formData.zoneId, ltcs]);

  const [skills] = useState<StudentSkill[]>(initialData?.skills || []);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl || null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setFormData({ ...formData, photoUrl: url });
    }
  };

  const toggleSoftware = (sw: string) => {
    setFormData((prev: any) => ({
      ...prev,
      softwareKnown: prev.softwareKnown.includes(sw) 
        ? prev.softwareKnown.filter((s: string) => s !== sw)
        : [...prev.softwareKnown, sw]
    }));
  };

  const handleGenerateBio = async () => {
    if (!formData.fullName) return;
    setIsGeneratingBio(true);
    const deptName = departments.find(d => d.id === formData.departmentId)?.name || 'General';
    const bio = await generateProfessionalBio(formData.fullName, formData.courseTitle || deptName, [deptName]);
    setFormData({ ...formData, bio });
    setIsGeneratingBio(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zoneId || !formData.ltcId) {
      alert("Please select Zone and Training Center (LTC)");
      return;
    }
    onSubmit({ ...formData, skills });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[70] flex items-center justify-center p-2">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <div className="p-6 bg-red-600 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
             <i className="fas fa-user-edit"></i>
             <h2 className="font-black uppercase text-xs tracking-widest">{initialData ? 'Edit Profile' : `Step ${step} of 4`}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto space-y-8 scroll-smooth no-scrollbar">
          
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Personal & Location</h3>
              <div className="flex flex-col items-center mb-6">
                <div 
                  onClick={() => photoInputRef.current?.click()}
                  className="w-24 h-24 bg-red-50 rounded-3xl border-2 border-dashed border-red-200 flex items-center justify-center cursor-pointer overflow-hidden relative group"
                >
                   {photoPreview ? (
                     <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                   ) : (
                     <i className="fas fa-camera text-2xl text-red-200"></i>
                   )}
                   <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                <p className="text-[8px] font-black text-red-400 uppercase mt-2">Upload Photo</p>
              </div>

              {/* Zone and LTC Selection */}
              <div className="bg-yellow-50 p-6 rounded-3xl space-y-4 border border-yellow-100">
                <p className="text-[10px] font-black text-orange-900 uppercase tracking-widest">Training Center Assignment</p>
                <div className="space-y-4">
                  <Select 
                    label="Operation Zone" 
                    options={zones.map(z => z.name)} 
                    value={zones.find(z => z.id === formData.zoneId)?.name || ''} 
                    onChange={(v: string) => {
                      const zone = zones.find(z => z.name === v);
                      setFormData({...formData, zoneId: zone?.id || '', ltcId: ''});
                    }} 
                    required 
                  />
                  <Select 
                    label="Live Training Center (LTC)" 
                    options={filteredLTCs.map(l => l.name)} 
                    value={filteredLTCs.find(l => l.id === formData.ltcId)?.name || ''} 
                    disabled={!formData.zoneId}
                    onChange={(v: string) => {
                      const ltc = filteredLTCs.find(l => l.name === v);
                      setFormData({...formData, ltcId: ltc?.id || ''});
                    }} 
                    required 
                  />
                </div>
              </div>

              <Input label="Full Name" value={formData.fullName} onChange={(v: string) => setFormData({...formData, fullName: v})} required />
              <Input label="Father's Name" value={formData.fatherName} onChange={(v: string) => setFormData({...formData, fatherName: v})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Birth Date" type="date" value={formData.dob} onChange={(v: string) => setFormData({...formData, dob: v})} required />
                <Select label="Gender" options={['Male', 'Female', 'Other']} value={formData.gender} onChange={(v: string) => setFormData({...formData, gender: v})} />
              </div>
              <Input label="Mobile" value={formData.mobile} onChange={(v: string) => setFormData({...formData, mobile: v})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="District" value={formData.district} onChange={(v: string) => setFormData({...formData, district: v})} required />
                <Input label="State" value={formData.state} onChange={(v: string) => setFormData({...formData, state: v})} required />
              </div>
              
              <button type="button" onClick={() => setStep(2)} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-100 active:scale-95">Next Step</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Education & Course</h3>
              <Select 
                label="Training Sector" 
                options={departments.map(d => d.name)} 
                value={departments.find(d => d.id === formData.departmentId)?.name || ''} 
                onChange={(v: string) => {
                  const dept = departments.find(d => d.name === v);
                  setFormData({...formData, departmentId: dept?.id || ''});
                }} 
              />
              <Input label="Course Title" value={formData.courseTitle} onChange={(v: string) => setFormData({...formData, courseTitle: v})} required placeholder="e.g. Basic Tailoring" />
              <Select label="Highest Education" options={['10th', '12th', 'ITI', 'Diploma', 'Graduate']} value={formData.educationLevel} onChange={(v: string) => setFormData({...formData, educationLevel: v})} />
              <Input label="Institute Name" value={formData.instituteName} onChange={(v: string) => setFormData({...formData, instituteName: v})} required />
              <Input label="Year of Passing" value={formData.passingYear} onChange={(v: string) => setFormData({...formData, passingYear: v})} required />
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Subjects Studied:</p>
                 <Check label="Maths" active={formData.studiedMaths} onToggle={() => setFormData({...formData, studiedMaths: !formData.studiedMaths})} />
                 <Check label="English" active={formData.studiedEnglish} onToggle={() => setFormData({...formData, studiedEnglish: !formData.studiedEnglish})} />
                 <Check label="Computers" active={formData.studiedComputers} onToggle={() => setFormData({...formData, studiedComputers: !formData.studiedComputers})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                <button type="button" onClick={() => setStep(3)} className="flex-[2] py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-100 active:scale-95">Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Skills & Computer</h3>
              <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-2xl">
                 <span className="text-xs font-black text-orange-900 uppercase">Computer Knowledge?</span>
                 <button type="button" onClick={() => setFormData({...formData, basicComputerKnowledge: !formData.basicComputerKnowledge})} className={`w-12 h-6 rounded-full relative transition-colors ${formData.basicComputerKnowledge ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.basicComputerKnowledge ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>
              <div className="space-y-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Software Known:</p>
                 <div className="flex flex-wrap gap-2">
                   {['MS Word', 'MS Excel (Basic)', 'Data Entry Software'].map(sw => (
                     <button 
                        key={sw}
                        type="button"
                        onClick={() => toggleSoftware(sw)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${
                          formData.softwareKnown.includes(sw) ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-100 text-slate-300'
                        }`}
                     >
                       {sw}
                     </button>
                   ))}
                 </div>
              </div>
              <Select label="Typing Speed" options={['Below 20 WPM', '20–30', '30+']} value={formData.typingSpeed} onChange={(v: string) => setFormData({...formData, typingSpeed: v})} />
              <div className="bg-red-50 p-6 rounded-3xl space-y-4">
                 <p className="text-[10px] font-black text-red-400 uppercase">English Level:</p>
                 <Check label="Read" active={formData.languages.english.read} onToggle={() => setFormData({...formData, languages: {...formData.languages, english: {...formData.languages.english, read: !formData.languages.english.read}}})} />
                 <Check label="Write" active={formData.languages.english.write} onToggle={() => setFormData({...formData, languages: {...formData.languages, english: {...formData.languages.english, write: !formData.languages.english.write}}})} />
                 <Check label="Speak" active={formData.languages.english.speak} onToggle={() => setFormData({...formData, languages: {...formData.languages, english: {...formData.languages.english, speak: !formData.languages.english.speak}}})} />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                <button type="button" onClick={() => setStep(4)} className="flex-[2] py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-red-100 active:scale-95">Next Step</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Work & Docs</h3>
              <Select label="Availability" options={['Full-time', 'Part-time', 'Shift work']} value={formData.availability} onChange={(v: string) => setFormData({...formData, availability: v})} />
              <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase">Documents Check:</p>
                 <Check label="Aadhaar Card" active={formData.documents.aadhaar} onToggle={() => setFormData({...formData, documents: {...formData.documents, aadhaar: !formData.documents.aadhaar}})} />
                 <Check label="Bank Account" active={formData.documents.bankAccount} onToggle={() => setFormData({...formData, documents: {...formData.documents, bankAccount: !formData.documents.bankAccount}})} />
                 <Check label="Education Certificate" active={formData.documents.educationCertificate} onToggle={() => setFormData({...formData, documents: {...formData.documents, educationCertificate: !formData.documents.educationCertificate}})} />
              </div>
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Self Pitch</label>
                    <button type="button" onClick={handleGenerateBio} disabled={isGeneratingBio} className="text-[8px] font-black text-red-500 uppercase flex items-center gap-1">
                      <i className={`fas ${isGeneratingBio ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i> AI Bio
                    </button>
                 </div>
                 <textarea rows={3} className="w-full p-4 bg-slate-50 border-2 border-slate-50 rounded-2xl outline-none focus:border-red-500 font-medium italic text-sm" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about yourself..." />
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(3)} className="flex-1 py-5 border-2 border-slate-100 rounded-2xl text-slate-400 font-black uppercase text-[10px] tracking-widest">Back</button>
                <button type="submit" className="flex-[2] py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-red-200 active:scale-95">{initialData ? 'Update Profile' : 'Register Profile'}</button>
              </div>
            </div>
          )}

        </form>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text", required, placeholder }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest px-1">{label} {required && "*"}</label>
    <input 
      required={required}
      type={type} 
      className="w-full px-5 py-4 rounded-xl border-2 border-slate-50 focus:border-red-500 outline-none transition-all bg-slate-50 focus:bg-white text-slate-800 font-bold text-sm"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

const Select = ({ label, options, value, onChange, disabled }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest px-1">{label}</label>
    <div className="relative">
      <select 
        disabled={disabled}
        className={`w-full px-5 py-4 rounded-xl border-2 border-slate-50 focus:border-red-500 outline-none appearance-none bg-slate-50 focus:bg-white font-bold text-slate-800 text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select Option</option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"></i>
    </div>
  </div>
);

const Check = ({ label, active, onToggle }: any) => (
  <button 
    type="button"
    onClick={onToggle}
    className="flex items-center gap-3 group cursor-pointer w-full text-left"
  >
    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${active ? 'bg-red-600 border-red-600 text-white' : 'border-slate-200 bg-white'}`}>
      {active && <i className="fas fa-check text-[10px]"></i>}
    </div>
    <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors uppercase tracking-tight">{label}</span>
  </button>
);

export default PortfolioForm;