import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  X, 
  Edit2, 
  ChevronRight, 
  Briefcase, 
  Calendar, 
  MapPin, 
  ExternalLink,
  Sparkles,
  Target,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useStudents } from '../../hooks/useStudents';
import { useApplications } from '../../hooks/useApplications';

const StudentProfile = () => {
  const { id } = useParams();
  const { getStudentById, updateStudentProfile, loading: studentLoading } = useStudents();
  const { getApplicationsByStudent, loading: appLoading } = useApplications();

  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadStudentProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadStudentProfile = async () => {
    try {
      setLoading(true);
      const [studentData, applicationsData] = await Promise.all([
        getStudentById(id),
        getApplicationsByStudent(id)
      ]);
      
      setStudent(studentData);
      setApplications(applicationsData || []);
      setFormData(studentData || {});
    } catch (error) {
      console.error('Failed to load student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setFormData({
      ...student,
      skills: student.skills ? student.skills.join(', ') : '',
      certifications: student.certifications ? student.certifications.join(', ') : ''
    });
    setMessage('');
    setShowEditModal(true);
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
      const updatedData = {
        ...formData,
        year: parseInt(formData.year),
        cgpa: parseFloat(formData.cgpa),
        skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : formData.skills,
        certifications: typeof formData.certifications === 'string' ? formData.certifications.split(',').map(c => c.trim()).filter(c => c) : formData.certifications
      };

      await updateStudentProfile(id, updatedData);
      setMessage('Trajectory successfully synchronized.');
      
      setTimeout(() => {
        setShowEditModal(false);
        loadStudentProfile();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'under_review': 'bg-charcoal-50 text-charcoal-500 border-charcoal-100',
      'shortlisted': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'accepted': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'rejected': 'bg-rose-50 text-rose-600 border-rose-100'
    };
    
    const classes = statusConfig[status] || 'bg-charcoal-50 text-charcoal-400 border-charcoal-100';
    return (
      <span className={`px-3 py-1 rounded-md text-[8px] font-nexed font-black border tracking-[0.2em] uppercase ${classes}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
           <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Retrieving Personnel File...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-charcoal-50 rounded-[2rem] flex items-center justify-center mb-8 border border-charcoal-100">
          <AlertTriangle size={40} className="text-charcoal-300" />
        </div>
        <h2 className="text-4xl font-nexed font-bold text-charcoal-900 mb-4 tracking-tight">Personnel Not Found</h2>
        <p className="text-charcoal-500 font-light italic max-w-md mb-12">The requested talent profile could not be retrieved from the central registry.</p>
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
          
          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Main Profile Card */}
            <div className="bg-white rounded-[3.5rem] border border-charcoal-50 p-10 shadow-sm relative overflow-hidden text-center">
               <div className="absolute top-0 right-0 w-32 h-32 bg-charcoal-gradient opacity-[0.02] rounded-full -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="relative z-10">
                  <div className="w-32 h-32 rounded-[2.5rem] bg-charcoal-50 border border-charcoal-100 p-1 mx-auto mb-8 shadow-sm group">
                     <img 
                       src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} 
                       alt="profile" 
                       className="w-full h-full rounded-[2.2rem] object-cover"
                     />
                  </div>
                  
                  <h2 className="text-3xl font-nexed font-bold text-charcoal-900 mb-2 tracking-tight">{student.name}</h2>
                  <p className="text-charcoal-400 text-[10px] font-nexed font-black uppercase tracking-[0.3em] mb-8">{student.department} • Tier {student.year}</p>
                  
                  <div className="space-y-4 mb-10">
                     <div className="flex items-center justify-center gap-3 text-charcoal-500 font-light italic">
                        <Mail size={16} className="text-charcoal-200" /> {student.email}
                     </div>
                     <div className="flex items-center justify-center gap-3 text-charcoal-500 font-light italic">
                        <Phone size={16} className="text-charcoal-200" /> {student.phone || 'Line Secured'}
                     </div>
                  </div>

                  <button 
                    onClick={handleEditProfile}
                    className="w-full py-5 bg-charcoal-gradient text-white rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] shadow-charcoal hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group"
                  >
                    Sync Profile <Edit2 size={16} className="group-hover:rotate-12 transition-transform" />
                  </button>
               </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-charcoal-gradient rounded-[3.5rem] p-12 text-white shadow-charcoal space-y-10">
               <div className="flex items-center gap-4 text-white/50">
                  <TrendingUp size={20} />
                  <span className="text-[10px] font-nexed font-black uppercase tracking-[0.3em]">Performance Metrics</span>
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                     <p className="text-5xl font-nexed font-bold tracking-tighter">{student.cgpa}</p>
                     <p className="text-[10px] font-nexed font-black text-white/40 uppercase tracking-widest">Global CGPA</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-5xl font-nexed font-bold tracking-tighter">{applications.length}</p>
                     <p className="text-[10px] font-nexed font-black text-white/40 uppercase tracking-widest">Active Mandates</p>
                  </div>
               </div>
               
               <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                     <ShieldCheck size={14} className="text-emerald-400" />
                     <span className="text-[10px] font-nexed font-black uppercase tracking-widest text-emerald-400">Verified Personnel</span>
                  </div>
                  <p className="text-white/50 text-sm font-light leading-relaxed italic">
                    "Consistent high-tier performance across academic and professional cycles."
                  </p>
               </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Skills & Certifications */}
            <div className="bg-white rounded-[3.5rem] border border-charcoal-50 p-10 md:p-16 shadow-sm space-y-16">
               <div className="space-y-10">
                  <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4">
                     Intellectual Assets <span className="flex-1 h-px bg-charcoal-50"></span>
                  </h3>
                  <div className="flex flex-wrap gap-4">
                     {student.skills && student.skills.map((skill, index) => (
                        <div key={index} className="px-6 py-3 bg-charcoal-50 rounded-2xl border border-charcoal-100 flex items-center gap-3 group hover:border-charcoal-300 transition-all">
                           <Target size={14} className="text-charcoal-300 group-hover:rotate-45 transition-transform" />
                           <span className="text-xs font-nexed font-black text-charcoal-800 uppercase tracking-widest">{skill}</span>
                        </div>
                     ))}
                     {!student.skills?.length && <p className="text-charcoal-300 italic font-light">No specific skillsets cataloged in current registry.</p>}
                  </div>
               </div>

               <div className="space-y-10">
                  <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4">
                     Accredited Accolades <span className="flex-1 h-px bg-charcoal-50"></span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {student.certifications && student.certifications.map((cert, index) => (
                        <div key={index} className="p-8 bg-charcoal-50/50 rounded-3xl border border-charcoal-100 flex items-start gap-6 group hover:bg-white hover:border-charcoal-200 transition-all">
                           <div className="w-12 h-12 rounded-xl bg-white border border-charcoal-100 flex items-center justify-center shrink-0">
                              <Award size={24} className="text-charcoal-300 group-hover:text-charcoal-800 transition-colors" />
                           </div>
                           <div>
                              <p className="font-nexed font-bold text-charcoal-800 mb-1">{cert}</p>
                              <p className="text-[9px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em]">Verified Certification</p>
                           </div>
                        </div>
                     ))}
                     {!student.certifications?.length && <p className="text-charcoal-300 italic font-light col-span-full">No professional certifications synchronized yet.</p>}
                  </div>
               </div>
            </div>

            {/* Application Feed */}
            <div className="space-y-8">
               <h3 className="text-[10px] font-nexed font-black text-charcoal-900 uppercase tracking-[0.4em] flex items-center gap-4 px-10">
                  Active Deployments <span className="flex-1 h-px bg-charcoal-50"></span>
               </h3>
               
               <div className="space-y-6">
                  {applications.length > 0 ? (
                    applications.map(app => (
                      <div key={app.id} className="bg-white rounded-[2.5rem] border border-charcoal-50 p-8 shadow-sm flex flex-wrap items-center justify-between gap-8 group hover:border-charcoal-200 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-300 overflow-hidden shrink-0">
                               <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.jobId?.company || 'JOBSY'}`} alt="job" className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 className="text-xl font-nexed font-bold text-charcoal-900 group-hover:text-charcoal-600 transition-colors">{app.jobId?.title || 'Classified Mandate'}</h4>
                               <div className="flex items-center gap-3 text-charcoal-400 text-[10px] font-nexed font-black uppercase tracking-widest mt-1">
                                  <Building2 size={12} /> {app.jobId?.company || 'Corporate Entity'}
                               </div>
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-12">
                            <div className="text-right hidden sm:block">
                               <p className="text-[9px] font-nexed font-black text-charcoal-300 uppercase tracking-[0.2em] mb-1">Transmission Date</p>
                               <p className="text-xs font-bold text-charcoal-600">{new Date(app.appliedDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-6">
                               {getStatusBadge(app.status)}
                               <Link to={`/job/${app.jobId?._id || app.jobId}`} className="p-3 bg-charcoal-50 rounded-xl text-charcoal-400 hover:text-charcoal-800 transition-all border border-charcoal-100">
                                  <ChevronRight size={20} />
                               </Link>
                            </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-20 bg-white rounded-[3rem] border border-charcoal-50 text-center shadow-sm">
                       <Briefcase size={40} className="text-charcoal-100 mx-auto mb-6" />
                       <p className="text-charcoal-400 font-light italic">No professional mandates currently in progress.</p>
                    </div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3.5rem] w-full max-w-3xl shadow-2xl border border-charcoal-50 overflow-hidden my-auto animate-fade-in">
            <div className="px-12 py-10 border-b border-charcoal-50 flex justify-between items-center bg-charcoal-50/30">
              <div>
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">Personnel Sync</p>
                <h3 className="text-3xl font-nexed font-bold text-charcoal-900 leading-tight">Edit Professional Trajectory</h3>
              </div>
              <button onClick={() => setShowEditModal(false)} className="text-charcoal-400 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl transition-all border border-charcoal-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              {message && (
                <div className={`p-6 rounded-2xl font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${message.includes('success') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {message.includes('success') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangle size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Full Identifier</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Communication Channel</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Tier (Year)</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Metric (CGPA)</label>
                    <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Talent ID</label>
                    <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Intellectual Assets (Comma Separated)</label>
                 <textarea name="skills" value={formData.skills} onChange={handleInputChange} rows={3} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-light text-charcoal-800 resize-none leading-relaxed" placeholder="React, Node.js, Strategic Thinking..." />
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
                      <>Commit Changes <Sparkles size={16} /></>
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

export default StudentProfile;
