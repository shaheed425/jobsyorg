import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { useNotifications } from '../../hooks/useNotifications';
import { Bell, CheckCircle2, AlertCircle, Clock, Briefcase, Calendar, User, ShieldCheck, Mail, Sparkles, Filter, MoreVertical, ChevronRight, X, Info } from 'lucide-react';

const Notifications = () => {
  const { user, userType } = useContext(AppContext);
  const { getAllNotifications, getNotificationsForRecipient, markAsRead, loading: notificationLoading } = useNotifications();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read

  useEffect(() => {
    loadNotifications();
  }, [userType, user]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      let notificationsData;

      if (userType === 'admin') {
        notificationsData = await getAllNotifications();
      } else {
        const recipientType = userType === 'student' ? 'student' : 'employer';
        const generalType = userType === 'student' ? 'all_students' : 'all_employers';
        
        const [specificNotifications, generalNotifications] = await Promise.all([
          getNotificationsForRecipient(recipientType, user.id),
          getNotificationsForRecipient(generalType)
        ]);
        
        notificationsData = [...specificNotifications, ...generalNotifications];
      }

      setNotifications(notificationsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.isRead);
      await Promise.all(unreadNotifications.map(notif => markAsRead(notif.id)));
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notif => !notif.isRead);
      case 'read':
        return notifications.filter(notif => notif.isRead);
      default:
        return notifications;
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high':
        return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'medium':
        return { text: 'text-charcoal-600', bg: 'bg-charcoal-50', border: 'border-charcoal-100' };
      case 'low':
        return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      default:
        return { text: 'text-charcoal-400', bg: 'bg-charcoal-50', border: 'border-charcoal-100' };
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'job_posting': Briefcase,
      'application_status': CheckCircle2,
      'interview_schedule': Calendar,
      'deadline_reminder': Clock,
      'profile_update': User,
      'company_verification': ShieldCheck
    };
    const Icon = icons[type] || Bell;
    return <Icon size={20} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-charcoal-100 border-t-charcoal-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="min-h-screen bg-background pb-24 font-sans text-charcoal-800">
      {/* Cinematic Header */}
      <div className="h-64 bg-white relative overflow-hidden border-b border-charcoal-50">
        <div className="absolute inset-0 bg-charcoal-gradient opacity-[0.02]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-charcoal-800/5 rounded-full blur-[150px]"></div>
        
        <div className="max-w-4xl mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-nexed font-bold text-charcoal-900 tracking-tight leading-none mb-4">Intelligence Feed</h1>
              <p className="text-charcoal-500 text-lg font-light tracking-wide italic">Critical insights and strategic updates delivered in real-time.</p>
            </div>
            <div className="flex items-center gap-4">
               {unreadCount > 0 && (
                 <button 
                   onClick={markAllAsRead}
                   className="px-6 py-3 rounded-xl glass border border-charcoal-100 text-charcoal-800 text-[10px] font-nexed font-black uppercase tracking-[0.2em] hover:bg-charcoal-50 transition-all shadow-sm"
                 >
                   Clear All Intel
                 </button>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-12 relative z-20">
        
        {/* Filtering Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-charcoal-100 p-2 mb-10 flex gap-2 shadow-xl">
          {[
            { id: 'all', label: 'All Intelligence', count: notifications.length },
            { id: 'unread', label: 'Active', count: unreadCount },
            { id: 'read', label: 'Archived', count: notifications.length - unreadCount }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-3.5 rounded-2xl text-[10px] font-nexed font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${filter === tab.id ? 'bg-charcoal-gradient text-white shadow-charcoal' : 'text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-50'}`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-md text-[8px] ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-charcoal-100 text-charcoal-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-6">
            {filteredNotifications.map(notification => {
              const priority = getPriorityStyles(notification.priority);
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-[2.5rem] border p-8 transition-all duration-500 group relative overflow-hidden ${notification.isRead ? 'border-charcoal-50 opacity-60' : 'border-charcoal-100 hover:border-charcoal-300 shadow-sm hover:shadow-xl'}`}
                >
                  {!notification.isRead && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-charcoal-gradient"></div>
                  )}
                  
                  <div className="flex gap-8 items-start">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border ${priority.bg} ${priority.text} ${priority.border}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                           <div className="flex items-center gap-3 mb-1">
                              <h4 className={`text-xl font-nexed font-bold ${notification.isRead ? 'text-charcoal-400' : 'text-charcoal-900'}`}>{notification.title}</h4>
                              {!notification.isRead && <span className="flex h-2 w-2 rounded-full bg-charcoal-800 animate-pulse"></span>}
                           </div>
                           <p className={`text-sm leading-relaxed mb-4 ${notification.isRead ? 'text-charcoal-500' : 'text-charcoal-600'}`}>{notification.message}</p>
                        </div>
                        <span className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-widest tabular-nums">
                           {new Date(notification.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6">
                         <div className="flex items-center gap-4">
                            <span className={`text-[9px] font-nexed font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border ${priority.bg} ${priority.text} ${priority.border}`}>
                               {notification.priority} Priority
                            </span>
                            <span className="text-[9px] font-nexed font-black text-charcoal-400 uppercase tracking-[0.2em]">
                               Type: {notification.type.replace('_', ' ')}
                            </span>
                         </div>
                         
                         {!notification.isRead && (
                           <button 
                             onClick={() => handleMarkAsRead(notification.id)}
                             className="text-[9px] font-nexed font-black text-charcoal-800 uppercase tracking-[0.2em] hover:text-charcoal-600 transition-colors flex items-center gap-2 group/btn"
                           >
                              Archive Intel <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                         )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-32 bg-white rounded-[3rem] border border-charcoal-100 text-center shadow-sm">
            <div className="w-24 h-24 bg-charcoal-50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-charcoal-100">
              <Bell className="text-charcoal-300" size={40} />
            </div>
            <h4 className="text-3xl font-nexed font-bold text-charcoal-900 mb-3">Void Detected</h4>
            <p className="text-charcoal-500 font-light italic max-w-sm mx-auto">
              {filter === 'unread' 
                ? 'No active intelligence streams currently require your strategic attention.'
                : 'The archives are currently empty of cataloged intelligence.'
              }
            </p>
          </div>
        )}

        {/* Legend / Info */}
        <div className="mt-16 bg-white rounded-[3rem] border border-charcoal-100 p-10 shadow-sm">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-charcoal-50 flex items-center justify-center text-charcoal-800">
                 <Info size={20} />
              </div>
              <div>
                 <h5 className="text-charcoal-900 font-nexed font-bold">Intelligence Protocols</h5>
                 <p className="text-[10px] font-nexed font-black text-charcoal-400 uppercase tracking-widest">Protocol Classification Legend</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                       <Briefcase size={18} />
                    </div>
                    <div>
                       <p className="text-charcoal-800 text-sm font-nexed font-bold">Strategic Postings</p>
                       <p className="text-charcoal-400 text-[10px] font-nexed uppercase tracking-widest mt-0.5">New Mandates & Roles</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                       <CheckCircle2 size={18} />
                    </div>
                    <div>
                       <p className="text-charcoal-800 text-sm font-nexed font-bold">Pipeline Trajectory</p>
                       <p className="text-charcoal-400 text-[10px] font-nexed uppercase tracking-widest mt-0.5">Status Transitions</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-800">
                       <Calendar size={18} />
                    </div>
                    <div>
                       <p className="text-charcoal-800 text-sm font-nexed font-bold">Engagements</p>
                       <p className="text-charcoal-400 text-[10px] font-nexed uppercase tracking-widest mt-0.5">Scheduled Sessions</p>
                    </div>
                 </div>
              </div>
              <div className="space-y-6">
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                       <Clock size={18} />
                    </div>
                    <div>
                       <p className="text-charcoal-800 text-sm font-nexed font-bold">Temporal Criticality</p>
                       <p className="text-charcoal-400 text-[10px] font-nexed uppercase tracking-widest mt-0.5">Deadline Indicators</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-400">
                       <User size={18} />
                    </div>
                    <div>
                       <p className="text-charcoal-800 text-sm font-nexed font-bold">Portfolio Evolution</p>
                       <p className="text-charcoal-400 text-[10px] font-nexed uppercase tracking-widest mt-0.5">Profile Modifications</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-5">
                    <div className="w-10 h-10 rounded-xl bg-charcoal-50 border border-charcoal-100 flex items-center justify-center text-charcoal-400">
                       <ShieldCheck size={18} />
                    </div>
                    <div>
                       <p className="text-charcoal-800 text-sm font-nexed font-bold">Authenticity</p>
                       <p className="text-charcoal-400 text-[10px] font-nexed uppercase tracking-widest mt-0.5">Verification Protocols</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
