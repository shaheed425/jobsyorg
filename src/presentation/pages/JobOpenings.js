import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Target, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Filter, 
  X, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  Star, 
  Sparkles, 
  Plus, 
  GraduationCap 
} from 'lucide-react';
import { AppContext } from '../../App';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';

const JobOpenings = () => {
  const { user, userType } = useContext(AppContext);
  const { getAllJobs, getJobsForStudent, loading: jobsLoading } = useJobs();
  const { submitApplication, loading: appLoading } = useApplications();
  
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    company: '',
    experience: ''
  });
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    documents: []
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState('');

  useEffect(() => {
    loadJobs();
  }, [userType, user]);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      let jobsData;
      
      if (userType === 'student') {
        jobsData = await getJobsForStudent(user.id);
      } else if (userType === 'employer') {
        jobsData = await getAllJobs();
        jobsData = jobsData.filter(job => job.companyId === user.id);
      } else {
        jobsData = await getAllJobs();
      }
      
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = jobs;

    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    if (filters.company) {
      filtered = filtered.filter(job => 
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.experience) {
      filtered = filtered.filter(job => 
        job.experience.toLowerCase().includes(filters.experience.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      company: '',
      experience: ''
    });
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    setApplicationMessage('');

    try {
      const response = await submitApplication({
        jobId: selectedJob.id,
        studentId: user.id,
        coverLetter: applicationData.coverLetter
      });

      if (response) {
        setApplicationMessage('Application transmission successful. Status: PENDING_VERIFICATION.');
        setTimeout(() => {
          setShowApplicationModal(false);
          setApplicationMessage('');
          setApplicationData({ coverLetter: '', documents: [] });
          loadJobs(); // Refresh application count
        }, 3000);
      }
    } catch (error) {
      setApplicationMessage(error.message || 'Application transmission failed. Protocol interrupt.');
    } finally {
      setApplicationLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Open': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[8px] font-nexed font-black uppercase tracking-[0.2em] rounded-md">Active Registry</span>;
      case 'Closing Soon': return <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[8px] font-nexed font-black uppercase tracking-[0.2em] rounded-md">Protocol Ending</span>;
      default: return <span className="px-3 py-1 bg-charcoal-50 text-charcoal-500 text-[8px] font-nexed font-black uppercase tracking-[0.2em] rounded-md">Archived</span>;
    }
  };

  const isDeadlineApproaching = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = Math.abs(deadlineDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
           <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Syncing Job Registry...</p>
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
                <Sparkles size={14} className="text-charcoal-800" />
                <span className="text-[10px] font-nexed font-black text-charcoal-800 uppercase tracking-[0.2em]">Verified Mandates</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 tracking-tight leading-[0.9]">Job <span className="text-charcoal-400">Openings.</span></h1>
             <p className="text-charcoal-500 font-light max-w-xl text-lg italic">Explore elite mandates curated for the next generation of industrial leadership.</p>
          </div>
          
          {userType === 'employer' && (
            <Link 
              to="/dashboard" 
              className="px-8 py-5 bg-charcoal-gradient text-white rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] shadow-charcoal hover:scale-[1.05] transition-all flex items-center gap-4"
            >
              Post Mandate <Plus size={18} />
            </Link>
          )}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-16 p-6 bg-white rounded-[2.5rem] border border-charcoal-50 shadow-sm">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-300" size={18} />
            <input 
              type="text" 
              name="company"
              placeholder="Search institutions..."
              value={filters.company}
              onChange={handleFilterChange}
              className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-6 text-charcoal-900 outline-none focus:border-charcoal-800 transition-all font-medium text-sm placeholder-charcoal-300"
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-300" size={18} />
            <input 
              type="text" 
              name="location"
              placeholder="Global locations..."
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-6 text-charcoal-900 outline-none focus:border-charcoal-800 transition-all font-medium text-sm placeholder-charcoal-300"
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-300" size={18} />
            <select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-6 text-charcoal-900 outline-none focus:border-charcoal-800 transition-all font-medium text-sm appearance-none cursor-pointer"
            >
              <option value="">Engagement Type</option>
              <option value="Full-time">Full-time Executive</option>
              <option value="Part-time">Part-time Strategic</option>
              <option value="Internship">Elite Residency</option>
              <option value="Contract">Strategic Consulting</option>
            </select>
          </div>
          <button 
            onClick={clearFilters}
            className="px-8 py-4 rounded-2xl border border-charcoal-100 text-charcoal-400 font-nexed font-black text-[10px] uppercase tracking-[0.2em] hover:bg-charcoal-50 transition-all"
          >
            Reset
          </button>
        </div>

        {/* Job Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="group relative">
                <div className="absolute inset-0 bg-charcoal-gradient rounded-[2.5rem] opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500"></div>
                <div className="bg-white rounded-[2.5rem] border border-charcoal-50 h-full flex flex-col overflow-hidden shadow-sm group-hover:shadow-md group-hover:border-charcoal-200 transition-all duration-500 group-hover:-translate-y-2">
                  
                  {/* Card Header */}
                  <div className="p-8 pb-0 flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center group-hover:border-charcoal-300 transition-all overflow-hidden shrink-0">
                       <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${job.company}`} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

                  {/* Card Body */}
                  <div className="p-8 flex-1">
                    <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-3">{job.company}</p>
                    <h3 className="text-2xl font-nexed font-bold text-charcoal-900 mb-6 group-hover:text-charcoal-600 transition-colors leading-tight">
                      <Link to={`/job/${job.id}`}>{job.title}</Link>
                    </h3>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-charcoal-500 text-sm font-light">
                         <MapPin size={16} className="text-charcoal-300" />
                         <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-charcoal-500 text-sm font-light">
                         <Briefcase size={16} className="text-charcoal-300" />
                         <span>{job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-3 text-charcoal-500 text-sm font-light">
                         <DollarSign size={16} className="text-charcoal-300" />
                         <span className="font-bold text-charcoal-800 uppercase tracking-tighter">{job.salary}</span>
                      </div>
                    </div>

                    <p className="text-charcoal-400 text-sm font-light leading-relaxed mb-8 line-clamp-3 italic">
                      "{job.description}"
                    </p>

                    {job.skills && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {job.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="px-3 py-1 bg-charcoal-50 rounded-lg text-[10px] font-nexed font-black text-charcoal-500 border border-charcoal-100 group-hover:border-charcoal-300 transition-all uppercase tracking-widest">
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 3 && (
                          <span className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-widest pt-1.5 pl-1">+{job.skills.length - 3}</span>
                        )}
                      </div>
                    )}

                    {isDeadlineApproaching(job.applicationDeadline) && (
                      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 mb-8 flex items-center gap-3">
                         <AlertTriangle size={16} className="text-rose-500" />
                         <span className="text-[10px] font-nexed font-black text-rose-500 uppercase tracking-widest">Closing Soon: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="p-8 pt-0 border-t border-charcoal-50 bg-charcoal-50/10">
                    <div className="flex items-center justify-between mb-6 pt-6">
                       <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-charcoal-400" />
                          <span className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-widest">{new Date(job.postedDate).toLocaleDateString()}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Star size={14} className="text-charcoal-300" />
                          <span className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-widest">{job.applicationsReceived} Aspirants</span>
                       </div>
                    </div>

                    <div className="flex gap-3">
                      <Link 
                        to={`/job/${job.id}`} 
                        className="flex-1 px-4 py-3.5 rounded-xl border border-charcoal-100 text-charcoal-500 font-nexed font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-charcoal-900 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                      >
                        Intel <ArrowRight size={14} />
                      </Link>
                      {userType === 'student' && (
                        <button 
                          onClick={() => handleApplyClick(job)}
                          disabled={new Date() > new Date(job.applicationDeadline)}
                          className={`flex-1 px-4 py-3.5 rounded-xl font-nexed font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-charcoal flex items-center justify-center gap-2 ${new Date() > new Date(job.applicationDeadline) ? 'bg-charcoal-100 text-charcoal-400 cursor-not-allowed shadow-none' : 'bg-charcoal-gradient text-white hover:brightness-110'}`}
                        >
                          {new Date() > new Date(job.applicationDeadline) ? 'Archived' : 'Initiate'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 bg-white rounded-[3rem] border border-charcoal-50 text-center shadow-sm">
              <div className="w-24 h-24 bg-charcoal-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-charcoal-100">
                <Target className="text-charcoal-300" size={40} />
              </div>
              <h4 className="text-3xl font-nexed font-bold text-charcoal-900 mb-3">No matching openings cataloged</h4>
              <p className="text-charcoal-500 font-light italic max-w-md mx-auto">
                {userType === 'student' 
                  ? "Adjust your strategic parameters or complete your professional portfolio to unlock new horizons."
                  : "No opportunities match the current search filters."
                }
              </p>
              <button 
                onClick={clearFilters}
                className="mt-10 px-8 py-4 bg-charcoal-50 rounded-2xl text-charcoal-800 font-nexed font-black uppercase tracking-[0.2em] text-xs hover:bg-charcoal-100 transition-all border border-charcoal-200"
              >
                Reset Parameters
              </button>
            </div>
          )}
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
              {applicationMessage && (
                <div className={`p-6 rounded-2xl mb-10 font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${applicationMessage.includes('successful') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {applicationMessage.includes('successful') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangle size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{applicationMessage}</p>
                </div>
              )}
              
              {selectedJob && (
                <div className="mb-12 p-8 bg-charcoal-50/50 rounded-[2rem] border border-charcoal-100">
                   <div className="flex items-center gap-6 mb-2">
                      <div className="w-16 h-16 rounded-2xl bg-white border border-charcoal-100 flex items-center justify-center shadow-sm overflow-hidden">
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedJob.company}`} alt="avatar" className="w-full h-full object-cover" />
                      </div>
                      <div>
                         <h4 className="text-2xl font-nexed font-bold text-charcoal-900 mb-1">{selectedJob.title}</h4>
                         <div className="flex items-center gap-4 text-charcoal-400 text-[10px] font-nexed font-black uppercase tracking-widest">
                            <span className="flex items-center gap-2"><Building2 size={12} /> {selectedJob.company}</span>
                            <span className="flex items-center gap-2"><MapPin size={12} /> {selectedJob.location}</span>
                         </div>
                      </div>
                   </div>
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

export default JobOpenings;
