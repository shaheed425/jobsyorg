import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Bell, 
  Users, 
  Building2, 
  Briefcase, 
  ClipboardList, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { AppContext } from '../../App';
import { useNotifications } from '../../hooks/useNotifications';

const Navbar = () => {
  const { user, userType, logout } = useContext(AppContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { getUnreadCount } = useNotifications();

  useEffect(() => {
    if (user && userType) {
      loadUnreadCount();
    }
  }, [user, userType]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount(
        userType === 'admin' ? 'all_students' : userType,
        userType !== 'admin' ? user.id : null
      );
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/notifications', label: 'Alerts', icon: Bell, badge: unreadCount }
    ];

    if (userType === 'admin') {
      return [
        ...commonItems,
        { path: '/students', label: 'Talent', icon: Users },
        { path: '/employers', label: 'Institutions', icon: Building2 },
        { path: '/jobs', label: 'Roles', icon: Briefcase },
        { path: '/applications', label: 'Pipeline', icon: ClipboardList }
      ];
    } else if (userType === 'student') {
      return [
        ...commonItems,
        { path: '/jobs', label: 'Openings', icon: Briefcase },
        { path: '/applications', label: 'My Pursuit', icon: ClipboardList },
        { path: `/student/${user.id}`, label: 'Portfolio', icon: User }
      ];
    } else if (userType === 'employer') {
      return [
        ...commonItems,
        { path: '/jobs', label: 'My Postings', icon: Briefcase },
        { path: '/applications', label: 'Candidates', icon: ClipboardList },
        { path: `/employer/${user.id}`, label: 'Profile', icon: Building2 }
      ];
    }

    return commonItems;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-2' : 'py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`glass rounded-full border border-charcoal-800/20 px-6 py-2.5 flex items-center justify-between transition-all duration-500 bg-charcoal-900/90 backdrop-blur-2xl shadow-2xl shadow-black/20`}>
          
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-charcoal-gradient rounded-xl flex items-center justify-center shadow-charcoal group-hover:rotate-12 transition-transform duration-500">
               <Sparkles size={18} className="text-pearl-500" />
            </div>
            <span className="text-xl font-nexed font-black charcoal-text-gradient tracking-tighter">Jobsy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2 rounded-full flex items-center gap-2.5 text-[10px] font-nexed font-bold uppercase tracking-[0.15em] transition-all duration-300 relative group ${active ? 'text-charcoal-900 bg-white shadow-xl' : 'text-pearl-500 hover:text-white hover:bg-white/5'}`}
                >
                  <Icon size={14} className={active ? 'text-charcoal-900' : 'text-charcoal-500 group-hover:text-pearl-400 transition-colors'} />
                  {item.label}
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border border-charcoal-900 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex w-9 h-9 rounded-full bg-white/5 border border-white/5 items-center justify-center text-pearl-600 hover:text-white hover:bg-white/10 transition-all">
              <Search size={16} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-3 bg-white/5 border border-white/5 pl-1.5 pr-4 py-1.5 rounded-full hover:bg-white/10 transition-all group"
              >
                <div className="w-7 h-7 rounded-full overflow-hidden bg-charcoal-800 border border-white/10">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || user?.username || 'User'}`} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                </div>
                <div className="hidden sm:block text-left">
                   <p className="text-[10px] font-nexed font-bold text-white leading-none mb-1">{user?.name || user?.username || 'Professional'}</p>
                   <p className="text-[8px] font-nexed font-black text-pearl-600 uppercase tracking-widest leading-none">Cataloged</p>
                </div>
                <ChevronDown size={12} className={`text-pearl-700 transition-transform duration-300 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsUserDropdownOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-64 glass rounded-3xl border border-charcoal-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 z-20 animate-fade-in-up">
                    <div className="px-6 py-4 border-b border-charcoal-50 mb-2">
                       <p className="text-charcoal-800 font-nexed font-bold">{user?.name || user?.username || 'Professional'}</p>
                       <p className="text-[9px] font-nexed font-black text-charcoal-500 uppercase tracking-widest mt-1">{userType} Tier</p>
                    </div>
                    
                    <Link to={userType === 'student' ? `/student/${user.id}` : userType === 'employer' ? `/employer/${user.id}` : '/dashboard'} className="flex items-center gap-4 px-6 py-3 text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-50/50 transition-all group">
                       <User size={18} className="text-charcoal-400 group-hover:text-charcoal-800 transition-colors" />
                       <span className="text-xs font-nexed font-bold">Manage Profile</span>
                    </Link>
                    
                    <Link to="/notifications" className="flex items-center gap-4 px-6 py-3 text-charcoal-500 hover:text-charcoal-800 hover:bg-charcoal-50/50 transition-all group">
                       <Bell size={18} className="text-charcoal-400 group-hover:text-charcoal-800 transition-colors" />
                       <span className="text-xs font-nexed font-bold">Intelligence Feed</span>
                       {unreadCount > 0 && <span className="ml-auto w-4 h-4 bg-rose-600 rounded-full text-[8px] flex items-center justify-center text-white font-nexed">{unreadCount}</span>}
                    </Link>
                    
                    <div className="h-px bg-charcoal-100 my-2 mx-6"></div>
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-3 text-rose-600 hover:bg-rose-500/5 transition-all group">
                       <LogOut size={18} />
                       <span className="text-xs font-nexed font-bold">Terminate Session</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-charcoal-500 hover:text-charcoal-800 transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[110] bg-pearl-200/98 backdrop-blur-xl lg:hidden p-8 animate-fade-in">
          <div className="flex justify-between items-center mb-12">
            <span className="text-2xl font-nexed font-black charcoal-text-gradient tracking-tighter">Jobsy</span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-charcoal-600 hover:text-charcoal-800 bg-charcoal-50 p-3 rounded-2xl">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-6 p-6 rounded-[2rem] border transition-all ${active ? 'bg-charcoal-gradient text-white border-charcoal-800/50 shadow-charcoal' : 'bg-white border-charcoal-100 text-charcoal-500'}`}
                >
                  <Icon size={24} />
                  <span className="text-xl font-nexed font-bold">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white text-xs font-nexed font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            
            <div className="pt-12">
               <button 
                 onClick={handleLogout}
                 className="w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] border border-rose-600/20 text-rose-600 bg-rose-500/5 font-nexed font-bold text-xl"
               >
                 <LogOut size={24} /> Terminate Session
               </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
