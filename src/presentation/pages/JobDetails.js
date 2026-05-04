import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Target, 
  DollarSign, 
  Calendar, 
  Clock, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Star,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  FileText,
  AlertTriangle,
  GraduationCap,
  ArrowRight,
  Globe
} from 'lucide-react';
import { AppContext } from '../../App';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';

const JobDetails = () => {
  const { id } = useParams();
  const { user, userType } = useContext(AppContext);
  const { getJobDetails, loading: jobsLoading } = useJobs();
  const { getApplicationsByJob, submitApplication, loading: appLoading } = useApplications();
  
  const [jobDetails, setJobDetails] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: ''
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const details = await getJobDetails(id);
      setJobDetails(details);
      
      if (userType === 'employer' || userType === 'admin') {
        const jobApplications = await getApplicationsByJob(id);
        setApplications(jobApplications || []);
      }
    } catch (error) {
      console.error('Failed to load job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    setApplicationData({ coverLetter: '' });
    setMessage('');
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    setMessage('');

    try {
      await submitApplication({
        jobId: jobDetails.job.id,
        studentId: user.id,
        coverLetter: applicationData.coverLetter
      });

      setMessage('Submission recorded. Success is imminent.');
      setTimeout(() => {
        setShowApplicationModal(false);
        setApplicationData({ coverLetter: '' });
        loadJobDetails();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setApplicationLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
      'inactive': { bg: 'bg-charcoal-50', text: 'text-charcoal-400', border: 'border-charcoal-100' },
      'closed': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' }
    };
    const config = statusConfig[status?.toLowerCase()] || statusConfig['active'];
    return (
      <span className={`px-4 py-1 rounded-md text-[8px] font-nexed font-black uppercase tracking-[0.2em] border ${config.bg} ${config.text} ${config.border}`}>
        {status || 'Active Registry'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
           <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Decoding Mandate Details...</p>
        </div>
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-charcoal-50 rounded-[2rem] flex items-center justify-center mb-8 border border-charcoal-100">
          <AlertTriangle size={40} className="text-charcoal-300" />
        </div>
        <h2 className="text-4xl font-nexed font-bold text-charcoal-900 mb-4 tracking-tight">Mandate Not Found</h2>
        <p className="text-charcoal-500 font-light italic max-w-md mb-12">The requested professional deployment could not be retrieved from the central registry.</p>
        <Link to="/jobs" className="px-10 py-4 bg-charcoal-gradient text-white rounded-2xl font-nexed font-black text-[10px] uppercase tracking-[0.3em] shadow-charcoal">
          Return to Hub
        </Link>
      </div>
    );
  }

  const { job, company } = jobDetails;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6 md:px-12 font-sans text-charcoal-800">
      <div className="max-w-7xl mx-auto">
        
        <Link to="/jobs" className="inline-flex items-center gap-3 text-charcoal-400 hover:text-charcoal-800 transition-colors mb-12 group font-nexed font-black text-[10px] uppercase tracking-[0.2em]">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Registry
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Header */}
            <div className="bg-white rounded-[3.5rem] border border-charcoal-50 p-10 md:p-16 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-charcoal-gradient opacity-[0.01] rounded-full -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                  <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center shadow-sm overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`} alt="logo" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h1 className="text-4xl md:text-5xl font-nexed font-bold text-charcoal-900 tracking-tight leading-tight">{job.title}</h1>
                              <Sparkles size={20} className="text-charcoal-400 animate-pulse shrink-0" />
                           </div>
                           <p className="text-charcoal-500 font-light flex items-center gap-3 text-lg">
                              <Building2 size={18} className="text-charcoal-300" /> {job.company} 
                              <span className="w-1.5 h-1.5 rounded-full bg-charcoal-100"></span> 
                              <MapPin size={18} className="text-charcoal-300" /> {job.location}
                           </p>
                        </div>
                     </div>
                     {getStatusBadge(job.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-charcoal-50">
                     <div className="space-y-1">
                        <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-[0.2em]">Mandate Type</p>
                        <p className="font-bold text-charcoal-800">{job.jobType}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-[0.2em]">Remuneration</p>
                        <p className="font-bold text-charcoal-800">{job.salary}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-[0.2em]">Posted On</p>
                        <p className="font-bold text-charcoal-800">{new Date(job.postedDate).toLocaleDateString()}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-[0.2em]">Deployments</p>
                        <p className="font-bold text-charcoal-800">{job.applicationsReceived} Applications</p>
                     </div>
                  </div>

                  <div className="mt-10 flex flex-wrap gap-4">
                     {userType === 'student' && (
                        <button 
                           onClick={handleApplyClick}
                           className="px-12 py-5 bg-charcoal-gradient text-white rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] shadow-charcoal hover:scale-[1.02] transition-all flex items-center gap-4 group"
                        >
                           Initiate Application <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     )}
                     <button className="px-10 py-5 bg-charcoal-50 text-charcoal-800 rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] hover:bg-charcoal-100 transition-all border border-charcoal-100 flex items-center gap-4">
                        Share Intellectual Property <ExternalLink size={16} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Description & Requirements */}
            <div className="bg-white rounded-[3.5rem] border border-charcoal-50 p-10 md:p-16 shadow-sm space-y-16">
               <div className="space-y-6">
                  <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4">
                     Mandate Overview <span className="flex-1 h-px bg-charcoal-50"></span>
                  </h3>
                  <div className="text-charcoal-500 font-light leading-loose text-lg whitespace-pre-line italic">
                     {job.description}
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4">
                     Strategic Requirements <span className="flex-1 h-px bg-charcoal-50"></span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {job.skills && job.skills.map((skill, index) => (
                        <div key={index} className="flex gap-4 items-center group">
                           <div className="w-12 h-12 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-800 group-hover:border-charcoal-300 transition-all">
                              <Target size={20} className="text-charcoal-300" />
                           </div>
                           <div>
                              <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-[0.2em]">Elite Skill</p>
                              <p className="font-bold text-charcoal-800 group-hover:text-charcoal-600 transition-colors">{skill}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-6">
                  <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4">
                     Deadline Protocol <span className="flex-1 h-px bg-charcoal-50"></span>
                  </h3>
                  <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-6">
                     <Clock size={32} className="text-rose-400" />
                     <div>
                        <p className="text-[10px] font-nexed font-black text-rose-400 uppercase tracking-[0.2em]">Application Closing</p>
                        <p className="text-2xl font-nexed font-bold text-rose-600">{new Date(job.applicationDeadline).toLocaleDateString()} — 23:59 GMT</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Institution Intelligence */}
            <div className="bg-white rounded-[3.5rem] border border-charcoal-50 p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute inset-0 bg-charcoal-gradient opacity-0 group-hover:opacity-[0.01] transition-opacity"></div>
               <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] mb-10">Institution Intel</h3>
               
               <div className="space-y-10">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center shadow-sm overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`} alt="company" className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h4 className="text-2xl font-nexed font-bold text-charcoal-900">{job.company}</h4>
                        <p className="text-charcoal-400 text-[10px] font-nexed font-black uppercase tracking-widest">{job.location}</p>
                     </div>
                  </div>

                  <p className="text-charcoal-500 font-light italic leading-relaxed">
                     "{company?.description || 'Corporate mission statement is currently classified.'}"
                  </p>

                  <div className="space-y-6">
                     <div className="flex items-center gap-4">
                        <Globe size={18} className="text-charcoal-300" />
                        <span className="text-charcoal-600 font-medium">official.website.com</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <ShieldCheck size={18} className="text-charcoal-300" />
                        <span className="text-emerald-600 font-nexed font-black text-[10px] uppercase tracking-widest">Verified Institution</span>
                     </div>
                  </div>

                  <button className="w-full py-5 rounded-[2rem] bg-charcoal-50 text-charcoal-800 font-nexed font-black text-[10px] uppercase tracking-[0.3em] hover:bg-charcoal-100 transition-all border border-charcoal-100 shadow-sm">
                     View Enterprise Profile
                  </button>
               </div>
            </div>

            {/* Strategic Value */}
            <div className="bg-charcoal-gradient rounded-[3.5rem] p-12 text-white shadow-charcoal relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
               
               <div className="relative z-10 space-y-8">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                     <Sparkles size={28} className="text-white" />
                  </div>
                  <h4 className="text-3xl font-nexed font-bold leading-tight tracking-tight">Catalyze Your Professional Trajectory.</h4>
                  <p className="text-white/70 font-light leading-relaxed italic">
                     "Jobsy mandates are curated for high-impact individuals seeking to redefine industry standards."
                  </p>
                  <div className="pt-4 flex items-center gap-3">
                     <Star size={16} className="text-white/50" />
                     <span className="text-[10px] font-nexed font-black uppercase tracking-[0.3em]">Elite Placement Protocol</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Initiation Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-3xl shadow-2xl border border-charcoal-50 overflow-hidden my-auto animate-fade-in">
            <div className="px-12 py-10 border-b border-charcoal-50 flex justify-between items-center bg-charcoal-50/30">
              <div>
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">Strategic Deployment</p>
                <h3 className="text-3xl font-nexed font-bold text-charcoal-900 leading-tight">Initiate Application</h3>
              </div>
              <button onClick={() => setShowApplicationModal(false)} className="text-charcoal-400 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl transition-all border border-charcoal-100">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-12">
              {message && (
                <div className={`p-6 rounded-2xl mb-10 font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${message.includes('successful') || message.includes('recorded') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {message.includes('successful') || message.includes('recorded') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangle size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{message}</p>
                </div>
              )}

              <form onSubmit={handleApplicationSubmit} className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4 px-1">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em]">Strategic Intent & Vision</label>
                    <span className={`text-[10px] font-nexed font-black uppercase tracking-widest ${applicationData.coverLetter.length < 50 ? 'text-rose-500' : 'text-charcoal-300'}`}>
                      {applicationData.coverLetter.length} / 1000
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    placeholder="Articulate your professional unique value proposition and strategic fit for this mandate..."
                    required
                    minLength={50}
                    maxLength={1000}
                    className="w-full px-8 py-6 rounded-3xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-light text-charcoal-800 resize-none leading-relaxed text-lg placeholder-charcoal-300"
                  />
                  <p className="text-[9px] text-charcoal-400 font-nexed font-black uppercase tracking-[0.1em] mt-3 ml-1">Minimal intensity: 50 characters required.</p>
                </div>

                <div className="pt-8 flex gap-6 justify-end">
                  <button type="button" onClick={() => setShowApplicationModal(false)} disabled={applicationLoading} className="px-10 py-4 rounded-2xl font-nexed font-black text-charcoal-400 hover:text-charcoal-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                    Cancel Initiation
                  </button>
                  <button 
                    type="submit" 
                    disabled={applicationLoading || applicationData.coverLetter.length < 50}
                    className="px-12 py-4 rounded-2xl font-nexed font-black text-white bg-charcoal-gradient hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-charcoal flex items-center gap-4 text-[10px] uppercase tracking-[0.2em]"
                  >
                    {applicationLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Transmitting...</>
                    ) : (
                      <>Transmit Application <Sparkles size={18} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
