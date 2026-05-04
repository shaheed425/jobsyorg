import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  User, 
  Users, 
  Briefcase, 
  Plus, 
  Edit2, 
  CheckCircle2, 
  Clock, 
  X, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Star,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { useEmployers } from '../../hooks/useEmployers';

const EmployerProfile = () => {
  const { id } = useParams();
  const { 
    getEmployerById, 
    getEmployerJobs, 
    getEmployerApplications, 
    updateEmployerProfile, 
    postJob, 
    loading: employerLoading 
  } = useEmployers();

  const [employer, setEmployer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [jobFormData, setJobFormData] = useState({
    title: '',
    location: '',
    jobType: 'Full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    skills: '',
    applicationDeadline: '',
    eligibilityCriteria: {
      minCGPA: 7.0,
      departments: [],
      year: 4
    }
  });
  const [message, setMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadEmployerProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadEmployerProfile = async () => {
    try {
      setLoading(true);
      const [employerData, jobsData, applicationsData] = await Promise.all([
        getEmployerById(id),
        getEmployerJobs(id),
        getEmployerApplications(id)
      ]);
      
      setEmployer(employerData);
      setJobs(jobsData || []);
      setApplications(applicationsData || []);
      setFormData(employerData || {});
    } catch (error) {
      console.error('Failed to load employer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setFormData(employer);
    setMessage('');
    setShowEditModal(true);
  };

  const handleAddJob = () => {
    setJobFormData({
      title: '',
      location: '',
      jobType: 'Full-time',
      experience: '',
      salary: '',
      description: '',
      requirements: '',
      skills: '',
      applicationDeadline: '',
      eligibilityCriteria: {
        minCGPA: 7.0,
        departments: [],
        year: 4
      }
    });
    setMessage('');
    setShowJobModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleJobInputChange = (e) => {
    if (e.target.name.startsWith('eligibility.')) {
      const field = e.target.name.split('.')[1];
      setJobFormData({
        ...jobFormData,
        eligibilityCriteria: {
          ...jobFormData.eligibilityCriteria,
          [field]: e.target.value
        }
      });
    } else {
      setJobFormData({
        ...jobFormData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');

    try {
      await updateEmployerProfile(id, formData);
      setMessage('Corporate identity synchronized.');
      setTimeout(() => {
        setShowEditModal(false);
        loadEmployerProfile();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage('');

    try {
      const jobData = {
        ...jobFormData,
        companyId: id,
        company: employer.companyName,
        skills: typeof jobFormData.skills === 'string' ? jobFormData.skills.split(',').map(s => s.trim()).filter(s => s) : jobFormData.skills,
        requirements: typeof jobFormData.requirements === 'string' ? jobFormData.requirements.split(',').map(r => r.trim()).filter(r => r) : jobFormData.requirements
      };

      await postJob(jobData);
      setMessage('New mandate successfully cataloged.');
      setTimeout(() => {
        setShowJobModal(false);
        loadEmployerProfile();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
           <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Decoding Corporate Registry...</p>
        </div>
      </div>
    );
  }

  if (!employer) {
    return (
      <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-charcoal-50 rounded-[2rem] flex items-center justify-center mb-8 border border-charcoal-100">
          <AlertTriangle size={40} className="text-charcoal-300" />
        </div>
        <h2 className="text-4xl font-nexed font-bold text-charcoal-900 mb-4 tracking-tight">Institution Not Found</h2>
        <p className="text-charcoal-500 font-light italic max-w-md mb-12">The requested corporate entity could not be retrieved from the central registry.</p>
        <Link to="/dashboard" className="px-10 py-4 bg-charcoal-gradient text-white rounded-2xl font-nexed font-black text-[10px] uppercase tracking-[0.3em] shadow-charcoal">
          Return to HQ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 font-sans text-charcoal-800">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Institution Header Card */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[4rem] border border-charcoal-50 p-12 md:p-20 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-charcoal-gradient opacity-[0.01] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-12">
                   <div className="w-40 h-40 rounded-[3rem] bg-charcoal-50 border border-charcoal-100 p-1 shadow-sm group-hover:shadow-md transition-all">
                      <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${employer.companyName}`} 
                        alt="company" 
                        className="w-full h-full rounded-[2.8rem] object-cover"
                      />
                   </div>
                   
                   <div className="flex-1 text-center md:text-left space-y-6">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                         <h1 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 tracking-tight leading-tight">{employer.companyName}</h1>
                         {employer.isVerified && (
                            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                               <ShieldCheck size={16} />
                               <span className="text-[10px] font-nexed font-black uppercase tracking-widest">Verified Institution</span>
                            </div>
                         )}
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-charcoal-500 font-light text-lg italic">
                         <span className="flex items-center gap-3"><MapPin size={18} className="text-charcoal-200" /> {employer.address || 'Global HQ'}</span>
                         <span className="flex items-center gap-3"><Globe size={18} className="text-charcoal-200" /> {employer.website || 'digital-presence.io'}</span>
                         <span className="flex items-center gap-3"><Mail size={18} className="text-charcoal-200" /> {employer.email}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-6">
                         <button 
                           onClick={handleEditProfile}
                           className="px-10 py-5 bg-charcoal-gradient text-white rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] shadow-charcoal hover:scale-[1.05] transition-all flex items-center gap-4"
                         >
                           Edit Profile <Edit2 size={16} />
                         </button>
                         <button 
                           onClick={handleAddJob}
                           className="px-10 py-5 bg-charcoal-50 text-charcoal-800 rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] hover:bg-charcoal-100 transition-all border border-charcoal-100 flex items-center gap-4"
                         >
                           New Mandate <Plus size={18} />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Stats Bar */}
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white rounded-[2.5rem] border border-charcoal-50 p-10 flex items-center justify-between shadow-sm group hover:border-charcoal-200 transition-all">
                <div>
                   <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-1">Active Mandates</p>
                   <p className="text-5xl font-nexed font-bold text-charcoal-900">{jobs.length}</p>
                </div>
                <div className="w-16 h-16 bg-charcoal-50 rounded-2xl flex items-center justify-center border border-charcoal-100 group-hover:rotate-12 transition-transform">
                   <Briefcase size={28} className="text-charcoal-300" />
                </div>
             </div>
             <div className="bg-white rounded-[2.5rem] border border-charcoal-50 p-10 flex items-center justify-between shadow-sm group hover:border-charcoal-200 transition-all">
                <div>
                   <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-1">Total Aspirants</p>
                   <p className="text-5xl font-nexed font-bold text-charcoal-900">{applications.length}</p>
                </div>
                <div className="w-16 h-16 bg-charcoal-50 rounded-2xl flex items-center justify-center border border-charcoal-100 group-hover:rotate-12 transition-transform">
                   <Users size={28} className="text-charcoal-300" />
                </div>
             </div>
             <div className="bg-charcoal-gradient rounded-[2.5rem] p-10 flex items-center justify-between shadow-charcoal group">
                <div className="text-white">
                   <p className="text-[10px] font-nexed font-black text-white/50 uppercase tracking-[0.3em] mb-1">Success Metric</p>
                   <p className="text-5xl font-nexed font-bold">84<span className="text-xl">%</span></p>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                   <TrendingUp size={28} className="text-white" />
                </div>
             </div>
          </div>

          {/* Institutional Mission */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[3.5rem] border border-charcoal-50 p-12 md:p-20 shadow-sm space-y-10">
                <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4">
                   Corporate Mission <span className="flex-1 h-px bg-charcoal-50"></span>
                </h3>
                <p className="text-charcoal-500 font-light leading-loose text-2xl md:text-3xl italic max-w-5xl">
                   "{employer.description || 'The institutional mission statement is currently undergoing strategic revision.'}"
                </p>
             </div>
          </div>

          {/* Job Mandates List */}
          <div className="lg:col-span-12 space-y-8">
             <div className="flex items-center justify-between px-10">
                <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em]">Current Mandates</h3>
                <button onClick={handleAddJob} className="text-charcoal-400 hover:text-charcoal-800 transition-colors flex items-center gap-2 font-nexed font-black text-[10px] uppercase tracking-widest">
                   Expand Portfolio <Plus size={14} />
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <div key={job.id} className="bg-white rounded-[3rem] border border-charcoal-50 p-10 shadow-sm group hover:border-charcoal-200 hover:-translate-y-2 transition-all duration-500">
                       <div className="flex justify-between items-start mb-8">
                          <div>
                             <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">{job.jobType}</p>
                             <h4 className="text-2xl font-nexed font-bold text-charcoal-900 group-hover:text-charcoal-600 transition-colors tracking-tight">{job.title}</h4>
                          </div>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-nexed font-black uppercase tracking-widest border border-emerald-100">Active</span>
                       </div>
                       
                       <div className="flex items-center gap-8 mb-10 text-charcoal-500 text-sm font-light italic">
                          <span className="flex items-center gap-2"><MapPin size={16} className="text-charcoal-200" /> {job.location}</span>
                          <span className="flex items-center gap-2"><DollarSign size={16} className="text-charcoal-200" /> {job.salary}</span>
                       </div>

                       <div className="flex items-center justify-between pt-8 border-t border-charcoal-50">
                          <div className="flex items-center gap-2">
                             <Users size={14} className="text-charcoal-300" />
                             <span className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-widest">{job.applicationsReceived} Aspirants</span>
                          </div>
                          <Link to={`/job/${job.id}`} className="p-3 bg-charcoal-50 rounded-xl text-charcoal-400 hover:text-charcoal-800 transition-all border border-charcoal-100">
                             <ArrowRight size={20} />
                          </Link>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-32 bg-white rounded-[3rem] border border-charcoal-50 text-center shadow-sm">
                     <Target size={40} className="text-charcoal-100 mx-auto mb-6" />
                     <p className="text-charcoal-400 font-light italic">No mandates currently cataloged in the institutional registry.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-4xl shadow-2xl border border-charcoal-50 overflow-hidden my-auto animate-fade-in">
            <div className="px-12 py-10 border-b border-charcoal-50 flex justify-between items-center bg-charcoal-50/30">
              <div>
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">Institution Sync</p>
                <h3 className="text-3xl font-nexed font-bold text-charcoal-900 leading-tight">Edit Corporate Identity</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-charcoal-400 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl transition-all border border-charcoal-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-12 space-y-10">
              {message && (
                <div className={`p-6 rounded-2xl font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${message.includes('success') || message.includes('synchronized') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {message.includes('success') || message.includes('synchronized') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangle size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Institution Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Corporate Domain</label>
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Headquarters</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Strategic Sector</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Corporate Mission Statement</label>
                 <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-light text-charcoal-800 resize-none leading-relaxed" placeholder="Briefly articulate your corporate mission and culture..." />
              </div>

              <div className="flex gap-6 justify-end pt-4">
                 <button type="button" onClick={() => setShowEditModal(false)} className="px-8 py-4 rounded-xl font-nexed font-black text-charcoal-400 hover:text-charcoal-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                    Abort Sync
                 </button>
                 <button 
                   type="submit" 
                   disabled={formLoading}
                   className="px-12 py-4 rounded-2xl font-nexed font-black text-white bg-charcoal-gradient hover:brightness-110 disabled:opacity-50 transition-all shadow-charcoal text-[10px] uppercase tracking-[0.2em] flex items-center gap-3"
                 >
                    {formLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Syncing...</>
                    ) : (
                      <>Commit Identity <Sparkles size={16} /></>
                    )}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-5xl shadow-2xl border border-charcoal-50 overflow-hidden my-auto animate-fade-in">
            <div className="px-12 py-10 border-b border-charcoal-50 flex justify-between items-center bg-charcoal-50/30">
              <div>
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">Mandate Initiation</p>
                <h3 className="text-3xl font-nexed font-bold text-charcoal-900 leading-tight">Catalog New Opportunity</h3>
              </div>
              <button onClick={() => setShowJobModal(false)} className="text-charcoal-400 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl transition-all border border-charcoal-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleJobSubmit} className="p-12 space-y-10">
              {message && (
                <div className={`p-6 rounded-2xl font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${message.includes('success') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {message.includes('success') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangle size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Mandate Title</label>
                    <input type="text" name="title" value={jobFormData.title} onChange={handleJobInputChange} placeholder="Ex: Senior Strategy Lead" required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Engagement Location</label>
                    <input type="text" name="location" value={jobFormData.location} onChange={handleJobInputChange} placeholder="Ex: Remote / New York, NY" required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Engagement Type</label>
                    <select name="jobType" value={jobFormData.jobType} onChange={handleJobInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 appearance-none cursor-pointer">
                       <option value="Full-time">Full-time Executive</option>
                       <option value="Part-time">Part-time Strategic</option>
                       <option value="Internship">Elite Residency</option>
                       <option value="Contract">Strategic Consulting</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Remuneration (Annual)</label>
                    <input type="text" name="salary" value={jobFormData.salary} onChange={handleJobInputChange} placeholder="Ex: $120k - $160k" className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Closure Deadline</label>
                    <input type="date" name="applicationDeadline" value={jobFormData.applicationDeadline} onChange={handleJobInputChange} required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Strategic Intent (Description)</label>
                 <textarea name="description" value={jobFormData.description} onChange={handleJobInputChange} rows={3} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-light text-charcoal-800 resize-none leading-relaxed" placeholder="Define the core objectives and impact of this role..." />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Mandatory Asset Requirements (Comma Separated)</label>
                 <textarea name="skills" value={jobFormData.skills} onChange={handleJobInputChange} rows={2} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-light text-charcoal-800 resize-none leading-relaxed" placeholder="Critical Thinking, Elite Communication, Strategic Planning..." />
              </div>

              <div className="bg-charcoal-50/50 p-10 rounded-[2.5rem] border border-charcoal-100 space-y-8">
                 <h4 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.3em]">Eligibility Protocols</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Minimum Metric (CGPA)</label>
                       <input type="number" step="0.1" name="eligibility.minCGPA" value={jobFormData.eligibilityCriteria.minCGPA} onChange={handleJobInputChange} className="w-full px-6 py-4 rounded-2xl bg-white border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Target Academic Tier</label>
                       <input type="number" name="eligibility.year" value={jobFormData.eligibilityCriteria.year} onChange={handleJobInputChange} className="w-full px-6 py-4 rounded-2xl bg-white border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                    </div>
                 </div>
              </div>

              <div className="flex gap-6 justify-end pt-4">
                 <button type="button" onClick={() => setShowJobModal(false)} className="px-8 py-4 rounded-xl font-nexed font-black text-charcoal-400 hover:text-charcoal-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                    Abort Initiation
                 </button>
                 <button 
                   type="submit" 
                   disabled={formLoading}
                   className="px-12 py-4 rounded-2xl font-nexed font-black text-white bg-charcoal-gradient hover:brightness-110 disabled:opacity-50 transition-all shadow-charcoal text-[10px] uppercase tracking-[0.2em] flex items-center gap-3"
                 >
                    {formLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Initiating...</>
                    ) : (
                      <>Deploy Mandate <Sparkles size={16} /></>
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

export default EmployerProfile;
