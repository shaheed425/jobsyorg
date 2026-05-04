import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Shield, User, Building2, Lock, Mail, ArrowLeft, ChevronRight, GraduationCap } from 'lucide-react';
import { AppContext } from '../../App';
import { adminAPI } from '../../data/api';
import { useStudents } from '../../hooks/useStudents';
import { useEmployers } from '../../hooks/useEmployers';

const AdminLogin = () => {
  const { login } = useContext(AppContext);
  const { getAllStudents } = useStudents();
  const { getAllEmployers } = useEmployers();

  const [activeTab, setActiveTab] = useState('admin');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminAPI.login(formData.username, formData.password);
      if (result.success) {
        login(result.user, 'admin');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const students = await getAllStudents();
      const student = students.find(s => 
        s.email === formData.email || s.studentId === formData.studentId
      );

      if (student) {
        login(student, 'student');
      } else {
        setError('Academic record not found. Please verify details.');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployerLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const employers = await getAllEmployers();
      const employer = employers.find(e => e.email === formData.email);

      if (employer) {
        login(employer, 'employer');
      } else {
        setError('Corporate record not found. Please verify details.');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'admin', label: 'Administration', icon: Shield },
    { id: 'student', label: 'Student Body', icon: GraduationCap },
    { id: 'employer', label: 'Corporate Entity', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden font-sans text-charcoal-800">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 bg-charcoal-gradient opacity-[0.02]"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-charcoal-800/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-charcoal-800/5 rounded-full blur-[150px] translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="w-full max-w-xl relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-charcoal-400 hover:text-charcoal-800 transition-colors mb-12 group uppercase tracking-[0.2em] text-[10px] font-nexed font-black">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Gateway
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 mb-4 tracking-tight leading-none">Authentication</h1>
          <p className="text-charcoal-500 text-lg font-light tracking-wide italic">Secure access to the elite placement ecosystem.</p>
        </div>

        <div className="bg-white rounded-[3rem] border border-charcoal-100 shadow-2xl overflow-hidden">
          {/* Custom Tabs */}
          <div className="flex border-b border-charcoal-50 bg-charcoal-50/50 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFormData({ username: '', password: '', email: '', studentId: '' });
                  setError('');
                }}
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[2rem] text-xs font-nexed font-black uppercase tracking-[0.15em] transition-all duration-500 ${
                  activeTab === tab.id 
                    ? 'bg-charcoal-gradient text-white shadow-charcoal' 
                    : 'text-charcoal-400 hover:text-charcoal-800 hover:bg-charcoal-100'
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-10 md:p-14">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-2xl mb-10 text-sm font-bold uppercase tracking-widest flex items-center gap-4">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            {activeTab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-8 animate-fade-in">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] mb-3 ml-1">Administrative ID</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors">
                        <User size={20} />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-5 text-charcoal-900 outline-none focus:border-charcoal-800 focus:ring-4 focus:ring-charcoal-800/5 transition-all font-medium placeholder-charcoal-300"
                        placeholder="Admin Username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] mb-3 ml-1">Encrypted Cipher</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors">
                        <Lock size={20} />
                      </div>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-5 text-charcoal-900 outline-none focus:border-charcoal-800 focus:ring-4 focus:ring-charcoal-800/5 transition-all font-medium placeholder-charcoal-300"
                        placeholder="Password"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal-gradient text-white py-5 rounded-2xl font-nexed font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all shadow-charcoal flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Establish Connection <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'student' && (
              <form onSubmit={handleStudentLogin} className="space-y-8 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] mb-3 ml-1">Academic Identifier</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors">
                      <Mail size={20} />
                    </div>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-5 text-charcoal-900 outline-none focus:border-charcoal-800 focus:ring-4 focus:ring-charcoal-800/5 transition-all font-medium placeholder-charcoal-300"
                      placeholder="Email or Student ID"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal-gradient text-white py-5 rounded-2xl font-nexed font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all shadow-charcoal flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Verify Status <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'employer' && (
              <form onSubmit={handleEmployerLogin} className="space-y-8 animate-fade-in">
                <div>
                  <label className="block text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] mb-3 ml-1">Corporate Domain</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-charcoal-400 group-focus-within:text-charcoal-800 transition-colors">
                      <Building2 size={20} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-charcoal-50 border border-charcoal-100 rounded-2xl py-4 pl-14 pr-5 text-charcoal-900 outline-none focus:border-charcoal-800 focus:ring-4 focus:ring-charcoal-800/5 transition-all font-medium placeholder-charcoal-300"
                      placeholder="Company Email Address"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-charcoal-gradient text-white py-5 rounded-2xl font-nexed font-black uppercase tracking-[0.2em] text-sm hover:brightness-110 transition-all shadow-charcoal flex items-center justify-center gap-3 group"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Authorize Access <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-12 text-center text-charcoal-400 text-[10px] font-nexed font-black uppercase tracking-[0.3em] leading-loose max-w-md mx-auto italic">
          This system is restricted to authorized personnel of the Jobsy elite placement ecosystem. All access attempts are cataloged.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
