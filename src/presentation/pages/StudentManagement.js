import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  GraduationCap, 
  Mail, 
  Phone, 
  BookOpen, 
  Star, 
  MoreVertical, 
  ChevronRight, 
  X, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Hash,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AppContext } from '../../App';
import { useStudents } from '../../hooks/useStudents';

const StudentManagement = () => {
  const { userType } = useContext(AppContext);
  const { getAllStudents, registerStudent, updateStudentProfile, loading: studentsLoading, error: studentsError } = useStudents();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    year: '',
    cgpa: '',
    skills: '',
    certifications: ''
  });
  const [message, setMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await getAllStudents();
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Failed to load students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsEditing(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      studentId: '',
      department: '',
      year: '',
      cgpa: '',
      skills: '',
      certifications: ''
    });
    setMessage('');
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      studentId: student.studentId || student.rollNumber || '',
      department: student.department || '',
      year: student.year?.toString() || '',
      cgpa: student.cgpa?.toString() || '',
      skills: student.skills ? student.skills.join(', ') : '',
      certifications: student.certifications ? student.certifications.join(', ') : ''
    });
    setMessage('');
    setShowModal(true);
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
      const studentData = {
        ...formData,
        year: parseInt(formData.year),
        cgpa: parseFloat(formData.cgpa),
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert)
      };

      if (isEditing) {
        await updateStudentProfile(selectedStudent.id || selectedStudent._id, studentData);
        setMessage('Personnel records synchronized successfully.');
      } else {
        await registerStudent({ ...studentData, password: 'Password123!', confirmPassword: 'Password123!' });
        setMessage('New talent cataloged into the registry.');
      }

      setTimeout(() => {
        setShowModal(false);
        loadStudents();
      }, 2000);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-32 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
           <div className="w-16 h-16 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
           <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Auditing Talent Registry...</p>
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
                <Users size={14} className="text-charcoal-800" />
                <span className="text-[10px] font-nexed font-black text-charcoal-800 uppercase tracking-[0.2em]">Personnel Management</span>
             </div>
             <h1 className="text-5xl md:text-7xl font-nexed font-bold text-charcoal-900 tracking-tight leading-[0.9]">Talent <span className="text-charcoal-400">Registry.</span></h1>
             <p className="text-charcoal-500 font-light max-w-xl text-lg italic">Monitor and manage the next generation of industrial leadership from the central hub.</p>
          </div>
          
          <button 
            onClick={handleAddStudent}
            className="px-8 py-5 bg-charcoal-gradient text-white rounded-[2rem] font-nexed font-black text-xs uppercase tracking-[0.3em] shadow-charcoal hover:scale-[1.05] transition-all flex items-center gap-4"
          >
            Catalog Talent <UserPlus size={18} />
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
           <div className="lg:col-span-8 relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal-300" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, email, or vertical..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-charcoal-50 rounded-[2rem] py-6 pl-16 pr-8 text-charcoal-900 outline-none focus:border-charcoal-200 transition-all font-medium shadow-sm placeholder-charcoal-200"
              />
           </div>
           <div className="lg:col-span-4 bg-charcoal-gradient rounded-[2rem] p-6 flex items-center justify-between shadow-charcoal">
              <div className="text-white pl-4">
                 <p className="text-[10px] font-nexed font-black text-white/50 uppercase tracking-[0.3em] mb-1">Total Cataloged</p>
                 <p className="text-3xl font-nexed font-bold tracking-tight">{students.length} Personnel</p>
              </div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                 <ShieldCheck size={24} className="text-white" />
              </div>
           </div>
        </div>

        {/* Talent Table/Grid */}
        <div className="bg-white rounded-[3.5rem] border border-charcoal-50 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-charcoal-50/50">
                       <th className="px-10 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Personnel Identity</th>
                       <th className="px-8 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Vertical & Tier</th>
                       <th className="px-8 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Performance</th>
                       <th className="px-8 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em]">Registry Status</th>
                       <th className="px-10 py-6 text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-charcoal-50">
                    {filteredStudents.map(student => (
                       <tr key={student.id || student._id} className="group hover:bg-charcoal-50/30 transition-colors">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center group-hover:border-charcoal-300 transition-all overflow-hidden shrink-0">
                                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.name}`} alt="avatar" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                   <p className="font-nexed font-bold text-charcoal-900 group-hover:text-charcoal-600 transition-colors text-lg tracking-tight">{student.name}</p>
                                   <p className="text-charcoal-400 text-sm font-light italic">{student.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="space-y-1">
                                <p className="font-bold text-charcoal-800">{student.department || 'Unassigned'}</p>
                                <p className="text-[10px] font-nexed font-black text-charcoal-300 uppercase tracking-widest">Academic Tier {student.year}</p>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-800">
                                   <TrendingUp size={16} />
                                </div>
                                <div>
                                   <p className="font-nexed font-bold text-charcoal-900">{student.cgpa}</p>
                                   <p className="text-[9px] font-nexed font-black text-charcoal-300 uppercase tracking-widest">CGPA Metric</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-8">
                             <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 w-fit">
                                <CheckCircle2 size={12} />
                                <span className="text-[8px] font-nexed font-black uppercase tracking-widest">Active</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditStudent(student)} className="p-3 bg-white rounded-xl text-charcoal-400 hover:text-charcoal-800 transition-all border border-charcoal-100 shadow-sm">
                                   <Edit3 size={18} />
                                </button>
                                <Link to={`/student/${student.id || student._id}`} className="p-3 bg-white rounded-xl text-charcoal-400 hover:text-charcoal-800 transition-all border border-charcoal-100 shadow-sm">
                                   <ChevronRight size={18} />
                                </Link>
                             </div>
                          </td>
                       </tr>
                    ))}
                    {filteredStudents.length === 0 && (
                       <tr>
                          <td colSpan="5" className="px-10 py-32 text-center">
                             <div className="w-20 h-20 bg-charcoal-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-charcoal-100">
                                <Search size={32} className="text-charcoal-200" />
                             </div>
                             <p className="text-charcoal-400 font-light italic">No personnel found matching the current search parameters.</p>
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
                <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.3em] mb-2">Registry Protocol</p>
                <h3 className="text-3xl font-nexed font-bold text-charcoal-900 leading-tight">
                   {isEditing ? 'Sync Personnel Data' : 'Catalog New Talent'}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-charcoal-400 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl transition-all border border-charcoal-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-12 space-y-10">
              {message && (
                <div className={`p-6 rounded-2xl font-nexed font-black text-[10px] uppercase tracking-widest flex items-start gap-5 ${message.includes('success') || message.includes('cataloged') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {message.includes('success') || message.includes('cataloged') ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertTriangle size={24} className="shrink-0" />}
                  <p className="leading-relaxed">{message}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Full Identifier</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Communication Channel</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Academic Vertical</label>
                    <select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900 appearance-none">
                       <option value="">Select Vertical</option>
                       <option value="Computer Science">Computer Science</option>
                       <option value="Information Technology">Information Technology</option>
                       <option value="Electronics">Electronics</option>
                       <option value="Mechanical">Mechanical</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Tier (Year)</label>
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em] ml-1">Metric (CGPA)</label>
                    <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-charcoal-50 border border-charcoal-100 focus:border-charcoal-800 outline-none transition-all font-medium text-charcoal-900" />
                 </div>
              </div>

              <div className="flex gap-6 justify-end pt-4">
                 <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-xl font-nexed font-black text-charcoal-400 hover:text-charcoal-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                    Abort Registry
                 </button>
                 <button 
                   type="submit" 
                   disabled={formLoading}
                   className="px-12 py-4 rounded-2xl font-nexed font-black text-white bg-charcoal-gradient hover:brightness-110 disabled:opacity-50 transition-all shadow-charcoal text-[10px] uppercase tracking-[0.2em] flex items-center gap-3"
                 >
                    {formLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                    ) : (
                      <>{isEditing ? 'Commit Changes' : 'Catalog Talent'} <Sparkles size={16} /></>
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

export default StudentManagement;
