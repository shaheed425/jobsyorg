import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { useStudents } from '../../hooks/useStudents';
import { useEmployers } from '../../hooks/useEmployers';
import { useJobs } from '../../hooks/useJobs';
import { useApplications } from '../../hooks/useApplications';
import { useNotifications } from '../../hooks/useNotifications';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Bell, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, userType } = useContext(AppContext);
  const { getAllStudents, getStudentById } = useStudents();
  const { getAllEmployers, getEmployerJobs, getEmployerApplications } = useEmployers();
  const { getAllJobs, getJobsForStudent } = useJobs();
  const { getAllApplications, getApplicationsByStudent } = useApplications();
  const { getAllNotifications, getNotificationsForRecipient } = useNotifications();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [userType, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      let data = {};

      if (userType === 'admin') {
        const [students, employers, jobs, applications, notifications] = await Promise.all([
          getAllStudents(),
          getAllEmployers(),
          getAllJobs(),
          getAllApplications(),
          getAllNotifications()
        ]);

        data = {
          totalStudents: students.length,
          eligibleStudents: students.filter(s => s.isEligible).length,
          totalEmployers: employers.length,
          verifiedEmployers: employers.filter(e => e.isVerified).length,
          totalJobs: jobs.length,
          activeJobs: jobs.filter(j => j.status === 'active').length,
          totalApplications: applications.length,
          recentApplications: applications.slice(-5).reverse(),
          recentJobs: jobs.slice(-5).reverse(),
          recentNotifications: notifications.slice(-10).reverse()
        };
      } else if (userType === 'student') {
        const [studentProfile, applications, jobs, notifications] = await Promise.all([
          getStudentById(user.id),
          getApplicationsByStudent(user.id),
          getJobsForStudent(user.id),
          getNotificationsForRecipient('student', user.id)
        ]);

        data = {
          profile: studentProfile,
          totalApplications: applications.length,
          pendingApplications: applications.filter(a => a.status === 'under_review').length,
          acceptedApplications: applications.filter(a => a.status === 'accepted').length,
          availableJobs: jobs.length,
          recentApplications: applications.slice(-5).reverse(),
          recommendedJobs: jobs.slice(0, 5),
          recentNotifications: notifications.slice(-5).reverse()
        };
      } else if (userType === 'employer') {
        const [employer, jobs, applications] = await Promise.all([
          getAllEmployers().then(list => list.find(e => e.id === user.id)),
          getEmployerJobs(user.id),
          getEmployerApplications(user.id)
        ]);

        data = {
          employer,
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.status === 'active').length,
          totalApplications: applications.length,
          applicationsByStatus: {
            under_review: applications.filter(app => app.status === 'under_review').length,
            shortlisted: applications.filter(app => app.status === 'shortlisted').length,
            accepted: applications.filter(app => app.status === 'accepted').length,
            rejected: applications.filter(app => app.status === 'rejected').length
          },
          recentJobs: jobs.slice(-5),
          recentApplications: applications.slice(-10)
        };
      }

      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'under_review': 'bg-charcoal-500/10 text-charcoal-600 border-charcoal-500/20',
      'shortlisted': 'bg-blue-600/10 text-blue-600 border-blue-600/20',
      'accepted': 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20',
      'rejected': 'bg-rose-600/10 text-rose-600 border-rose-600/20',
      'active': 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20',
      'inactive': 'bg-charcoal-400/10 text-charcoal-400 border-charcoal-400/20'
    };
    
    const classes = statusConfig[status] || 'bg-charcoal-400/10 text-charcoal-400 border-charcoal-400/20';
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-nexed font-black border ${classes}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, subValue, trend }) => (
    <div className="bg-white p-6 rounded-3xl border border-charcoal-100 relative overflow-hidden group hover:border-charcoal-300 transition-all duration-500 shadow-sm hover:shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={48} />
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-charcoal-50 rounded-2xl flex items-center justify-center text-charcoal-800 border border-charcoal-100">
          <Icon size={24} />
        </div>
        <span className="text-charcoal-500 font-nexed font-black tracking-widest uppercase text-[10px]">{title}</span>
      </div>
      <div className="flex items-baseline gap-3">
        <h3 className="text-3xl font-nexed font-bold text-charcoal-900">{value}</h3>
        {trend && <span className="text-emerald-600 text-sm font-bold">{trend}</span>}
      </div>
      {subValue && <p className="text-pearl-600 text-sm mt-2 font-light">{subValue}</p>}
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          title="Total Students" 
          value={dashboardData?.totalStudents || 0} 
          subValue={`${dashboardData?.eligibleStudents || 0} eligible for placement`}
        />
        <StatCard 
          icon={UserCheck} 
          title="Total Employers" 
          value={dashboardData?.totalEmployers || 0} 
          subValue={`${dashboardData?.verifiedEmployers || 0} verified accounts`}
        />
        <StatCard 
          icon={Briefcase} 
          title="Total Jobs" 
          value={dashboardData?.totalJobs || 0} 
          subValue={`${dashboardData?.activeJobs || 0} currently active`}
        />
        <StatCard 
          icon={FileText} 
          title="Applications" 
          value={dashboardData?.totalApplications || 0} 
          trend="+12% this week"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="glass rounded-[2rem] border border-pearl-900/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-pearl-900/10 flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold text-white">Recent Applications</h3>
            <button className="text-gold-500 text-sm font-bold hover:text-gold-400 transition-colors uppercase tracking-widest">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-onyx-950/50 text-pearl-700 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Student</th>
                  <th className="px-8 py-4">Position</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pearl-900/10">
                {dashboardData.recentApplications.map(app => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 font-medium text-white">{app.studentName}</td>
                    <td className="px-8 py-5 text-pearl-400">{app.jobTitle}</td>
                    <td className="px-8 py-5">{getStatusBadge(app.status)}</td>
                    <td className="px-8 py-5 text-pearl-600 text-sm">{new Date(app.applicationDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Job Postings */}
        <div className="glass rounded-[2rem] border border-pearl-900/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-pearl-900/10 flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold text-white">Latest Opportunities</h3>
            <button className="text-gold-500 text-sm font-bold hover:text-gold-400 transition-colors uppercase tracking-widest">Post Job</button>
          </div>
          <div className="p-4 space-y-4">
            {dashboardData?.recentJobs?.map(job => (
              <Link to={`/job/${job.id}`} key={job.id} className="block group">
                <div className="p-5 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-pearl-900/20 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold group-hover:text-gold-400 transition-colors">{job.title}</h4>
                    <p className="text-pearl-500 text-sm font-light mt-1">{job.company} • {job.applicationsReceived} applicants</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(job.status)}
                    <ChevronRight className="text-pearl-800 group-hover:text-gold-500 transition-all" size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStudentDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} title="Applications" value={dashboardData.totalApplications} />
        <StatCard icon={Clock} title="Pending Review" value={dashboardData.pendingApplications} />
        <StatCard icon={CheckCircle} title="Offers Received" value={dashboardData.acceptedApplications} />
        <StatCard icon={TrendingUp} title="Available Jobs" value={dashboardData.availableJobs} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-[2rem] border border-pearl-900/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-pearl-900/10 flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold text-white">Application Journey</h3>
          </div>
          <div className="p-8">
            {dashboardData.recentApplications.length > 0 ? (
              <div className="space-y-6">
                {dashboardData.recentApplications.map(app => (
                  <div key={app.id} className="flex items-center gap-6 p-5 rounded-2xl bg-onyx-800/50 border border-pearl-900/10 hover:border-gold-500/20 transition-all">
                    <div className="w-12 h-12 bg-onyx-900 rounded-xl flex items-center justify-center text-gold-500 border border-pearl-900/20">
                      <Briefcase size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-bold">{app.jobTitle}</h4>
                      <p className="text-pearl-500 text-sm font-light">{app.company} • Applied on {new Date(app.applicationDate).toLocaleDateString()}</p>
                    </div>
                    <div>{getStatusBadge(app.status)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-pearl-600 font-light italic mb-6">No applications yet. Your future starts here.</p>
                <Link to="/jobs" className="bg-gold-gradient text-onyx-900 px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all">
                  Browse Premium Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-[2rem] border border-pearl-900/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-pearl-900/10">
            <h3 className="text-xl font-serif font-bold text-white">Elite Matches</h3>
          </div>
          <div className="p-6 space-y-4">
            {dashboardData.recommendedJobs.length > 0 ? (
              dashboardData.recommendedJobs.map(job => (
                <Link key={job.id} to={`/job/${job.id}`} className="block p-5 rounded-2xl hover:bg-white/5 border border-transparent hover:border-pearl-900/10 transition-all group">
                  <h4 className="text-white font-bold group-hover:text-gold-400 transition-colors">{job.title}</h4>
                  <p className="text-pearl-500 text-xs font-medium uppercase tracking-widest mt-2">{job.company} • {job.location}</p>
                  <div className="mt-4 flex items-center text-gold-500 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">
                    View Details <ChevronRight size={14} />
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-pearl-700 text-sm font-light italic p-4">Refine your profile to unlock AI-powered elite matches.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployerDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Briefcase} title="Total Posted" value={dashboardData.totalJobs} />
        <StatCard icon={TrendingUp} title="Active Roles" value={dashboardData.activeJobs} />
        <StatCard icon={Users} title="Applicants" value={dashboardData.totalApplications} trend="+24% this month" />
        <StatCard icon={UserCheck} title="Shortlisted" value={dashboardData.applicationsByStatus.shortlisted} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[2rem] border border-pearl-900/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-pearl-900/10">
            <h3 className="text-xl font-serif font-bold text-white">Talent Pipeline</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-onyx-950/50 text-pearl-700 text-xs uppercase tracking-widest font-bold">
                  <th className="px-8 py-4">Talent</th>
                  <th className="px-8 py-4">Role</th>
                  <th className="px-8 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pearl-900/10">
                {dashboardData.recentApplications.map(app => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-5 font-medium text-white">{app.studentName}</td>
                    <td className="px-8 py-5 text-pearl-400">{app.jobTitle}</td>
                    <td className="px-8 py-5">{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-[2rem] border border-pearl-900/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-pearl-900/10 flex justify-between items-center">
            <h3 className="text-xl font-serif font-bold text-white">Manage Listings</h3>
            <Link to="/jobs/new" className="text-gold-500 text-sm font-bold uppercase tracking-widest hover:text-gold-400">Add New</Link>
          </div>
          <div className="p-4 space-y-4">
            {dashboardData.recentJobs.map(job => (
              <div key={job.id} className="p-6 rounded-2xl bg-onyx-800/30 border border-pearl-900/10 hover:border-gold-500/20 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-bold">{job.title}</h4>
                    <p className="text-pearl-500 text-sm mt-1 font-light">{job.applicationsReceived} candidates applied</p>
                  </div>
                  <Link to={`/job/${job.id}`} className="text-pearl-700 hover:text-gold-500 transition-colors">
                    <ChevronRight size={24} />
                  </Link>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-pearl-900/5 pt-4">
                  <span className="text-pearl-800 text-[10px] uppercase font-bold tracking-widest">Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                  {getStatusBadge(job.status)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-onyx-900 pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></div>
              <span className="text-gold-500 text-xs font-bold uppercase tracking-[0.2em]">Dashboard Elite</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-white mb-2">
              Welcome back, <span className="text-white">{user?.name || user?.username || user?.companyName}</span>
            </h1>
            <p className="text-pearl-600 font-light tracking-wide">Here is what is happening across your network today.</p>
          </div>
          <div className="flex gap-4">
            <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-pearl-400 hover:text-gold-500 hover:border-gold-500/30 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-onyx-900"></span>
            </button>
            <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center text-onyx-900 font-black shadow-gold">
              {String(user?.name || user?.username || user?.companyName || 'U').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {userType === 'admin' && renderAdminDashboard()}
        {userType === 'student' && renderStudentDashboard()}
        {userType === 'employer' && renderEmployerDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
