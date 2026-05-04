import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Building2, 
  Mail, 
  Lock, 
  Phone, 
  Hash, 
  GraduationCap, 
  BookOpen, 
  TrendingUp, 
  Globe, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStudents } from '../../hooks/useStudents';
import { useEmployers } from '../../hooks/useEmployers';

const Register = () => {
  const navigate = useNavigate();
  const { registerStudent, loading: studentLoading } = useStudents();
  const { registerEmployer, loading: employerLoading } = useEmployers();

  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    rollNumber: '',
    department: '',
    year: '',
    cgpa: ''
  });

  const [employerForm, setEmployerForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    industry: '',
    address: '',
    contactPerson: '',
    description: ''
  });

  const handleStudentChange = (e) => {
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
  };

  const handleEmployerChange = (e) => {
    setEmployerForm({ ...employerForm, [e.target.name]: e.target.value });
  };

  const validateStudentForm = () => {
    if (!studentForm.name || !studentForm.email || !studentForm.password) {
      setError('Essential fields must be fulfilled.');
      return false;
    }
    if (studentForm.password !== studentForm.confirmPassword) {
      setError('Secret protocols do not match.');
      return false;
    }
    if (studentForm.password.length < 6) {
      setError('Security protocol requires at least 6 characters.');
      return false;
    }
    return true;
  };

  const validateEmployerForm = () => {
    if (!employerForm.companyName || !employerForm.email || !employerForm.password) {
      setError('Corporate identifiers must be provided.');
      return false;
    }
    if (employerForm.password !== employerForm.confirmPassword) {
      setError('Secret protocols do not match.');
      return false;
    }
    if (employerForm.password.length < 6) {
      setError('Security protocol requires at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateStudentForm()) return;

    try {
      setLoading(true);
      const studentData = {
        ...studentForm,
        userType: 'student',
        isEligible: true,
        skills: [],
        certifications: []
      };
      
      await registerStudent(studentData);
      setSuccess('Talent cataloged. Welcome to the elite.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message || 'Transmission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmployerForm()) return;

    try {
      setLoading(true);
      const employerData = {
        ...employerForm,
        userType: 'employer',
        isVerified: false
      };
      
      await registerEmployer(employerData);
      setSuccess('Institution registered. Verification protocol initiated.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.message || 'Transmission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden font-sans text-charcoal-800">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-charcoal-gradient opacity-[0.02]"></div>
      <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-charcoal-800/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Sidebar - Visual Brand */}
      <div className="lg:w-[40%] lg:min-h-screen bg-white relative p-10 md:p-20 flex flex-col justify-between border-r border-charcoal-50 z-10">
         <div className="space-y-12">
            <Link to="/" className="text-3xl font-nexed font-black text-charcoal-900 tracking-tighter">
               JOBSY<span className="text-charcoal-400">.</span>
            </Link>
            
            <div className="space-y-8">
               <h1 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 tracking-tight leading-[0.9]">Catalog Your <span className="text-charcoal-400">Future.</span></h1>
               <p className="text-charcoal-500 text-lg font-light leading-relaxed max-w-sm italic">Join the elite network of industrial talent and visionary institutions.</p>
               
               <div className="space-y-8">
                  <div className="flex gap-4 items-center group">
                     <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-800 group-hover:border-charcoal-300 transition-all">
                        <ShieldCheck size={20} />
                     </div>
                     <span className="text-[10px] font-nexed font-black uppercase tracking-[0.2em] text-charcoal-400 group-hover:text-charcoal-800 transition-colors">Verified Integrity</span>
                  </div>
                  <div className="flex gap-4 items-center group">
                     <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-800 group-hover:border-charcoal-300 transition-all">
                        <Globe size={20} />
                     </div>
                     <span className="text-[10px] font-nexed font-black uppercase tracking-[0.2em] text-charcoal-400 group-hover:text-charcoal-800 transition-colors">Global Exposure</span>
                  </div>
               </div>
            </div>
            
            <div className="relative z-10 pt-12">
               <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-4">Already Cataloged?</p>
               <Link to="/login" className="inline-flex items-center gap-2 text-charcoal-800 font-nexed font-bold hover:text-charcoal-600 transition-colors group">
                  Sign In to Registry <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         </div>
      </div>

      {/* Form Area */}
      <div className="lg:w-[60%] p-10 md:p-16 bg-background">
         
         <div className="max-w-4xl mx-auto">
            {/* Custom Tab Switcher */}
            <div className="flex gap-2 p-1.5 bg-charcoal-50/50 rounded-2xl border border-charcoal-100 mb-12 max-w-sm shadow-inner">
               <button 
                 onClick={() => { setActiveTab('student'); setError(''); }}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-nexed font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'student' ? 'bg-charcoal-gradient text-white shadow-charcoal' : 'text-charcoal-400 hover:text-charcoal-800 hover:bg-charcoal-100'}`}
               >
                 <User size={14} /> Talent
               </button>
               <button 
                 onClick={() => { setActiveTab('employer'); setError(''); }}
                 className={`flex-1 py-3 rounded-xl text-[10px] font-nexed font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${activeTab === 'employer' ? 'bg-charcoal-gradient text-white shadow-charcoal' : 'text-charcoal-400 hover:text-charcoal-800 hover:bg-charcoal-100'}`}
               >
                 <Building2 size={14} /> Institution
               </button>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-nexed font-black uppercase tracking-widest mb-8 flex items-center gap-3 animate-shake">
                 <XCircle size={18} /> {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-nexed font-black uppercase tracking-widest mb-8 flex items-center gap-3 animate-fade-in">
                 <CheckCircle2 size={18} /> {success}
              </div>
            )}

            {activeTab === 'student' ? (
              <form onSubmit={handleStudentSubmit} className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                      <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                          <input type="text" name="name" value={studentForm.name} onChange={handleStudentChange} placeholder="Ex: Julian Thorne" required className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Secure Email</label>
                      <div className="relative group">
                         <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                         <input type="email" name="email" value={studentForm.email} onChange={handleStudentChange} placeholder="julian@excellence.edu" required className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Protocol Secret (Password)</label>
                      <div className="relative group">
                         <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                         <input type={showPassword ? "text" : "password"} name="password" value={studentForm.password} onChange={handleStudentChange} placeholder="••••••••" required className="w-full px-5 py-4 pl-14 pr-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-800 transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                         </button>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Confirm Secret</label>
                      <div className="relative group">
                         <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                         <input type="password" name="confirmPassword" value={studentForm.confirmPassword} onChange={handleStudentChange} placeholder="••••••••" required className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Secure Line (Phone)</label>
                      <div className="relative group">
                         <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                         <input type="tel" name="phone" value={studentForm.phone} onChange={handleStudentChange} placeholder="+1 (555) 000-0000" className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Talent ID (Roll No.)</label>
                      <div className="relative group">
                         <Hash className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                         <input type="text" name="rollNumber" value={studentForm.rollNumber} onChange={handleStudentChange} placeholder="TH-990-2024" className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Vertical</label>
                      <select name="department" value={studentForm.department} onChange={handleStudentChange} className="w-full px-5 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 appearance-none cursor-pointer">
                         <option value="">Select Department</option>
                         <option value="Computer Science">Computer Science</option>
                         <option value="Information Technology">Information Technology</option>
                         <option value="Electronics">Electronics</option>
                         <option value="Mechanical">Mechanical</option>
                         <option value="Civil">Civil</option>
                         <option value="Electrical">Electrical</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Academic Tier</label>
                      <select name="year" value={studentForm.year} onChange={handleStudentChange} className="w-full px-5 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 appearance-none cursor-pointer">
                         <option value="">Select Year</option>
                         <option value="1">1st Year</option>
                         <option value="2">2nd Year</option>
                         <option value="3">3rd Year</option>
                         <option value="4">4th Year</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Metric (CGPA)</label>
                      <div className="relative group">
                         <TrendingUp className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                         <input type="number" step="0.01" min="0" max="10" name="cgpa" value={studentForm.cgpa} onChange={handleStudentChange} placeholder="9.50" className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full py-5 rounded-[2rem] bg-charcoal-gradient text-white font-nexed font-black uppercase tracking-[0.3em] text-xs shadow-charcoal hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 group mt-4"
                >
                   {loading ? (
                     <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Cataloging...</>
                   ) : (
                     <>Catalog Portfolio <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                   )}
                </button>
              </form>
            ) : (
               <form onSubmit={handleEmployerSubmit} className="space-y-8 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Corporate Identity</label>
                        <div className="relative group">
                           <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                           <input type="text" name="companyName" value={employerForm.companyName} onChange={handleEmployerChange} placeholder="Ex: Thorne Industries" required className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Corporate Email</label>
                        <div className="relative group">
                           <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                           <input type="email" name="email" value={employerForm.email} onChange={handleEmployerChange} placeholder="hq@thorne.co" required className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Security Key</label>
                        <div className="relative group">
                           <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                           <input type={showPassword ? "text" : "password"} name="password" value={employerForm.password} onChange={handleEmployerChange} placeholder="••••••••" required className="w-full px-5 py-4 pl-14 pr-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-800 transition-colors">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Confirm Key</label>
                        <div className="relative group">
                           <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                           <input type="password" name="confirmPassword" value={employerForm.confirmPassword} onChange={handleEmployerChange} placeholder="••••••••" required className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Digital Domain (URL)</label>
                        <div className="relative group">
                           <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                           <input type="url" name="website" value={employerForm.website} onChange={handleEmployerChange} placeholder="https://thorne.co" className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">HQ Base (Address)</label>
                        <div className="relative group">
                           <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors" size={18} />
                           <input type="text" name="address" value={employerForm.address} onChange={handleEmployerChange} placeholder="Silicon Valley, CA" className="w-full px-5 py-4 pl-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 placeholder-charcoal-300" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Corporate Mission</label>
                     <textarea name="description" rows={3} value={employerForm.description} onChange={handleEmployerChange} placeholder="Briefly articulate your corporate mission and culture..." className="w-full px-5 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-light text-charcoal-600 resize-none leading-relaxed" />
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 rounded-[2rem] bg-charcoal-gradient text-white font-nexed font-black uppercase tracking-[0.3em] text-xs shadow-charcoal hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-4 group mt-4"
                  >
                     {loading ? (
                       <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Initiating Registry...</>
                     ) : (
                       <>Register Institution <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                     )}
                  </button>
               </form>
            )}
         </div>
      </div>
    </div>
  );
};

export default Register;
