import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { useApplications } from '../../hooks/useApplications';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  ChevronRight, 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  User,
  ExternalLink,
  MessageSquare,
  Target
} from 'lucide-react';

const Applications = () => {
  const { user, userType } = useContext(AppContext);
  const { 
    getAllApplications, 
    getApplicationsByStudent, 
    updateApplicationStatus, 
    loading: applicationsLoading 
  } = useApplications();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, [user, userType]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      let data;
      if (userType === 'admin') {
        data = await getAllApplications();
      } else if (userType === 'student') {
        data = await getApplicationsByStudent(user.id);
      } else {
        // Employers would see applications for their jobs
        // This logic might need refinement based on employer jobs
        const allApps = await getAllApplications();
        data = allApps.filter(app => app.companyId === user.id);
      }
      setApplications(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      'under_review': { 
        label: 'Under Review', 
        icon: Clock, 
        color: 'text-charcoal-600', 
        bg: 'bg-charcoal-50', 
        border: 'border-charcoal-100' 
      },
      'shortlisted': { 
        label: 'Shortlisted', 
        icon: CheckCircle2, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50', 
        border: 'border-blue-100' 
      },
      'accepted': { 
        label: 'Accepted', 
        icon: CheckCircle2, 
        color: 'text-emerald-600', 
        bg: 'bg-emerald-50', 
        border: 'border-emerald-100' 
      },
      'rejected': { 
        label: 'Rejected', 
        icon: XCircle, 
        color: 'text-rose-600', 
        bg: 'bg-rose-50', 
        border: 'border-rose-100' 
      }
    };
    return configs[status] || configs['under_review'];
  };

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-charcoal-800">
      {/* Cinematic Header */}
      <div className="h-64 bg-white relative overflow-hidden border-b border-charcoal-50">
        <div className="absolute inset-0 bg-charcoal-gradient opacity-[0.02]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-charcoal-800/5 rounded-full blur-[150px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-nexed font-bold text-charcoal-900 tracking-tight leading-none mb-4">Pursuit Log</h1>
              <p className="text-charcoal-500 text-lg font-light tracking-wide italic">Tracking your strategic progression through the elite talent pipeline.</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-widest mb-1">Total Initiatives</p>
                <p className="text-3xl font-nexed font-bold text-charcoal-900">{applications.length}</p>
              </div>
              <div className="w-14 h-14 bg-charcoal-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <FileText size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        {/* Filtering Protocols */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-charcoal-100 p-2 mb-10 flex flex-wrap gap-2 shadow-xl">
          {[
            { id: 'all', label: 'All Initiatives' },
            { id: 'under_review', label: 'In Review' },
            { id: 'shortlisted', label: 'Shortlisted' },
            { id: 'accepted', label: 'Success' },
            { id: 'rejected', label: 'Archived' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-8 py-3.5 rounded-2xl text-[10px] font-nexed font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${filter === tab.id ? 'bg-charcoal-gradient text-white shadow-charcoal' : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-50'}`}
            >
              {tab.label}
              {tab.id !== 'all' && applications.filter(a => a.status === tab.id).length > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[8px] ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-charcoal-100 text-charcoal-500'}`}>
                  {applications.filter(a => a.status === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Application Cards Grid */}
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredApps.map(app => {
              const status = getStatusConfig(app.status);
              const StatusIcon = status.icon;
              
              return (
                <div key={app.id} className="bg-white rounded-[3rem] border border-charcoal-100 p-10 hover:shadow-2xl hover:shadow-charcoal/5 transition-all duration-500 group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 group-hover:opacity-10 transition-opacity ${status.bg}`}></div>
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 bg-charcoal-50 rounded-2xl flex items-center justify-center border border-charcoal-100 overflow-hidden shadow-inner">
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.company}`} alt="Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-nexed font-bold text-charcoal-900 group-hover:text-charcoal-700 transition-colors">{app.jobTitle}</h3>
                        <p className="text-charcoal-500 font-nexed font-black uppercase tracking-widest text-[10px] mt-1">{app.company}</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${status.bg} ${status.color} ${status.border}`}>
                      <StatusIcon size={14} />
                      <span className="text-[10px] font-nexed font-black uppercase tracking-wider">{status.label}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                     <div className="p-4 rounded-2xl bg-charcoal-50/50 border border-charcoal-50">
                        <p className="text-[9px] font-nexed font-black text-charcoal-400 uppercase tracking-widest mb-1">Applied Date</p>
                        <div className="flex items-center gap-2 text-charcoal-700 font-bold text-sm">
                           <Calendar size={14} className="text-charcoal-400" />
                           {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                     <div className="p-4 rounded-2xl bg-charcoal-50/50 border border-charcoal-50">
                        <p className="text-[9px] font-nexed font-black text-charcoal-400 uppercase tracking-widest mb-1">Initiative ID</p>
                        <div className="flex items-center gap-2 text-charcoal-700 font-bold text-sm">
                           <Target size={14} className="text-charcoal-400" />
                           #{String(app.id).slice(-6).toUpperCase()}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="p-6 rounded-[2rem] bg-charcoal-900 text-pearl-100">
                        <div className="flex items-center gap-2 mb-3">
                           <MessageSquare size={14} className="text-pearl-500" />
                           <p className="text-[9px] font-nexed font-black uppercase tracking-widest text-pearl-600">Strategic Intent</p>
                        </div>
                        <p className="text-sm font-light leading-relaxed italic opacity-80 line-clamp-3">
                           "{app.coverLetter}"
                        </p>
                     </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-charcoal-50 flex items-center justify-between">
                     {userType === 'student' ? (
                       <button className="flex items-center gap-2 text-charcoal-400 hover:text-charcoal-900 transition-colors text-[10px] font-nexed font-black uppercase tracking-widest group/link">
                          View Mandate Details <ExternalLink size={12} className="group-hover/link:translate-x-1 transition-transform" />
                       </button>
                     ) : (
                       <div className="flex gap-3 w-full">
                          <button 
                            className="flex-1 py-3 rounded-xl bg-charcoal-900 text-white font-nexed font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
                            onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                          >
                             Shortlist
                          </button>
                          <button 
                            className="flex-1 py-3 rounded-xl border border-charcoal-100 text-charcoal-800 font-nexed font-black text-[10px] uppercase tracking-widest hover:bg-charcoal-50 transition-all"
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                          >
                             Archive
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-40 bg-white rounded-[4rem] border border-charcoal-100 text-center shadow-sm">
             <div className="w-24 h-24 bg-charcoal-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-charcoal-100">
                <FileText size={40} className="text-charcoal-200" />
             </div>
             <h3 className="text-4xl font-nexed font-bold text-charcoal-900 mb-4">Protocol Empty</h3>
             <p className="text-charcoal-500 font-light italic max-w-md mx-auto">
                No initiatives matching your current strategic filters have been logged in the pursuit log.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
