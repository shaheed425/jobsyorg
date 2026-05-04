import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  CheckCircle2, 
  ShieldAlert, 
  MoreVertical, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  X, 
  ExternalLink, 
  ChevronRight, 
  Users, 
  TrendingUp, 
  Clock,
  ShieldCheck,
  ShieldCheck as ShieldCheckIcon,
  Sparkles,
  Sparkles as SparklesIcon,
  ArrowRight,
  AlertTriangle,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-react';
import { AppContext } from '../../App';
import { useEmployers } from '../../hooks/useEmployers';

// Using consistent lucide-react imports
const EmployerManagement = () => {
  const { userType } = useContext(AppContext);
  const { 
    getAllEmployers, 
    registerEmployer, 
    updateEmployerProfile, 
    verifyEmployer: apiVerifyEmployer, 
    loading: employerLoading, 
    error: employerError 
  } = useEmployers();
  
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    industry: '',
    companySize: '',
    description: '',
    contactPerson: '',
    contactDesignation: ''
  });
  const [message, setMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEmployers();
  }, []);

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const employersData = await getAllEmployers();
      setEmployers(employersData || []);
    } catch (error) {
      console.error('Failed to load employers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployer = () => {
    setSelectedEmployer(null);
    setIsEditing(false);
    setFormData({
      companyName: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      industry: '',
      companySize: '',
      description: '',
      contactPerson: '',
      contactDesignation: ''
    });
    setMessage('');
    setShowModal(true);
  };

  const handleEditEmployer = (employer) => {
    setSelectedEmployer(employer);
    setIsEditing(true);
    setFormData({
      companyName: employer.companyName,
      email: employer.email,
      phone: employer.phone || '',
      website: employer.website || '',
      address: employer.address || '',
      industry: employer.industry || '',
      companySize: employer.companySize || '',
      description: employer.description || '',
      contactPerson: employer.contactPerson || '',
      contactDesignation: employer.contactDesignation || ''
    });
    setMessage('');
    setShowModal(true);
  };

  const handleVerifyEmployer = async (employerId) => {
    try {
      await apiVerifyEmployer(employerId);
      setMessage('Institution identity verified successfully.');
      loadEmployers();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');

    try {
      if (isEditing) {
        await updateEmployerProfile(selectedEmployer.id || selectedEmployer._id, formData);
        setMessage('Corporate records synchronized successfully.');
      } else {
        await registerEmployer({ ...formData, password: 'Password123!', confirmPassword: 'Password123!' });
        setMessage('New institution registered in the central hub.');
      }

      setTimeout(() => {
        setShowModal(false);
        loadEmployers();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredEmployers = employers.filter(employer => 
    employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employer.industry && employer.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
           <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Auditing Corporate Registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 font-sans text-charcoal-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div className="space-y-4">
             <div className="inline-flex items-center gap-3 px-4 py-2 bg-charcoal-50 rounded-xl border border-charcoal-100">
                <Building2 size={14} className="text-charcoal-800" />
                <span className="text-[10px] font-nexed font-black text-charcoal-800 uppercase tracking-[0.2em]">Institutional Hub</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 tracking-tight leading-[0.9]">Employer <span className="text-charcoal-400">Registry.</span></h1>
             <p className="text-charcoal-500 font-light max-w-xl text-lg italic">Oversee the elite network of industrial partners and corporate visionaries.</p>
          </div>
          
          <button 
            onClick={handleAddEmployer}
            className="px-8 py-5 bg-charcoal-gradient text-white rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] shadow-charcoal hover:scale-[1.05] transition-all flex items-center gap-4"
          >
            Register Institution <Plus size={18} />
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
           <div className="lg:col-span-8 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-300" size={20} />
              <input 
                type="text" 
                placeholder="Search by company name, industry, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-charcoal-50 rounded-[2rem] py-6 pl-16 pr-8 text-charcoal-900 outline-none focus:border-charcoal-200 transition-all font-medium shadow-sm placeholder-charcoal-200"
              />
           </div>
           <div className="lg:col-span-4 bg-charcoal-gradient rounded-[2rem] p-6 flex items-center justify-between shadow-charcoal">
              <div className="text-white pl-4">
                 <p className="text-[10px] font-nexed font-black text-white/50 uppercase tracking-[0.3em] mb-1">Active Partners</p>
                 <p className="text-3xl font-nexed font-bold tracking-tight">{employers.length} Institutions</p>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                 <ShieldCheckIcon size={24} className="text-white" />
              </div>
           </div>
        </div>

        {/* Employer Table/Grid */}
        <div className="bg-white rounded-[3.5rem] border border-charcoal-50 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-charcoal-50/50">
                       <th className="px-10 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Institutional Identity</th>
                       <th className="px-8 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Sector & HQ</th>
                       <th className="px-8 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Deployment Metrics</th>
                       <th className="px-8 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Verification Status</th>
                       <th className="px-10 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-charcoal-50">
                    {filteredEmployers.map(employer => (
                       <tr key={employer.id || employer._id} className="group hover:bg-charcoal-50/30 transition-colors">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center group-hover:border-charcoal-300 transition-all overflow-hidden shrink-0 shadow-sm">
                                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${employer.companyName}`} alt="logo" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <p className="font-nexed font-bold text-charcoal-900 group-hover:text-charcoal-600 transition-colors text-lg tracking-tight">{employer.companyName}</p>
                                   <p className="text-charcoal-400 text-sm font-light italic">{employer.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="space-y-1">
                                <p className="font-bold text-charcoal-800">{employer.industry || 'Global Partner'}</p>
                                <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-widest">{employer.address || 'HQ Undisclosed'}</p>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-800">
                                   <Briefcase size={16} />
                                </div>
                                <div>
                                   <p className="font-nexed font-bold text-charcoal-900">{employer.jobsCount || 0}</p>
                                   <p className="text-[9px] font-nexed font-black text-charcoal-300 uppercase tracking-widest">Active Mandates</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             {employer.isVerified ? (
                                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 w-fit">
                                   <ShieldCheckIcon size={12} />
                                   <span className="text-[8px] font-nexed font-black uppercase tracking-widest">Verified</span>
                                </div>
                             ) : (
                                <button 
                                  onClick={() => handleVerifyEmployer(employer.id || employer._id)}
                                  className="flex items-center gap-2 px-3 py-1 bg-charcoal-50 text-charcoal-400 rounded-lg border border-charcoal-100 w-fit hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all"
                                >
                                   <ShieldAlert size={12} />
                                   <span className="text-[8px] font-nexed font-black uppercase tracking-widest">Unverified</span>
                                </button>
                             )}
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditEmployer(employer)} className="p-3 bg-white rounded-xl text-charcoal-400 hover:text-charcoal-800 transition-all border border-charcoal-100 shadow-sm">
                                   <Edit2 size={18} />
                                </button>
                                <Link to={`/employer/${employer.id || employer._id}`} className="p-3 bg-white rounded-xl text-charcoal-400 hover:text-charcoal-800 transition-all border border-charcoal-100 shadow-sm">
                                   <ChevronRight size={18} />
                                </Link>
                             </div>
                          </td>
                       </tr>
                    ))}
                    {filteredEmployers.length === 0 && (
                       <tr>
                          <td colSpan="5" className="px-10 py-32 text-center">
                             <div className="w-20 h-20 bg-charcoal-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-charcoal-100">
                                <Building2 size={32} className="text-charcoal-200" />
                             </div>
                             <p className="text-charcoal-400 font-light italic">No institutions found matching the current search parameters.</p>
                          </td>
                       </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Modal - Unified Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl border border-charcoal-50 overflow-hidden my-auto animate-fade-in">
            <div className="px-12 py-10 border-b border-charcoal-50 flex justify-between items-center bg-charcoal-50/30">
              <div>
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">Institutional Protocol</p>
                <h3 className="text-3xl font-nexed font-bold text-charcoal-900 leading-tight">
                   {isEditing ? 'Sync Corporate Data' : 'Register New Institution'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-charcoal-400 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl transition-all border border-charcoal-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              {message && (
                <div className={`p-6 rounded-2xl font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${message.includes('success') || message.includes('synchronized') || message.includes('registered') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {message.includes('success') || message.includes('synchronized') || message.includes('registered') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangleIcon size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Institution Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Corporate Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Strategic Sector</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" placeholder="Ex: Tech, FinTech" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">HQ Base</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" placeholder="Ex: Silicon Valley, CA" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Institution Size</label>
                    <select name="companySize" value={formData.companySize} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 appearance-none">
                       <option value="">Select Scale</option>
                       <option value="1-50">Emerging (1-50)</option>
                       <option value="51-200">Growth (51-200)</option>
                       <option value="201-1000">Scale (201-1000)</option>
                       <option value="1000+">Enterprise (1000+)</option>
                    </select>
                 </div>
              </div>

              <div className="flex gap-6 justify-end pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-xl font-nexed font-black text-charcoal-400 hover:text-charcoal-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                    Abort Sync
                 </button>
                 <button 
                   type="submit" 
                   disabled={formLoading}
                   className="px-12 py-4 rounded-2xl font-nexed font-black text-white bg-charcoal-gradient hover:brightness-110 disabled:opacity-50 transition-all shadow-charcoal text-[10px] uppercase tracking-[0.2em] flex items-center gap-3"
                 >
                    {formLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                    ) : (
                      <>{isEditing ? 'Commit Changes' : 'Register Institution'} <SparklesIcon size={16} /></>
                    )}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerManagement;
