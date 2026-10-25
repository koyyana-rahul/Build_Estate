import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Calendar,
  LogOut,
  LayoutDashboard,
  Bell,
  User,
  ClipboardList,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Building2,
  Menu,
  Cpu,
} from 'lucide-react';
import { cn } from '../lib/utils';
import apiClient from '../services/apiClient';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed.toString());
  }, [isCollapsed]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname, setIsOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  const isActive = (path) => location.pathname === path;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/api/users/admin/logout'); // revokes the refresh cookie
    } catch {
      // best-effort — clear the local session regardless
    }
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const navSections = [
    {
      label: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/pending-listings', label: 'Review Queue', icon: ClipboardList },
        { path: '/list', label: 'All Properties', icon: Building2 },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/appointments', label: 'Appointments', icon: Calendar },
      ],
    },
    {
      label: 'AI & Activity',
      items: [
        { path: '/ai-models', label: 'AI Models', icon: Cpu },
        { path: '/activity-logs', label: 'Activity Logs', icon: FileText },
      ],
    },
  ];

  return (
    <>
      <style>{`
        .sidebar-nav::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-nav::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .sidebar-nav::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>

      {/* Sidebar */}
      <aside
        aria-label="Admin navigation"
        className={cn(
          'fixed inset-y-0 left-0 w-[min(18rem,calc(100vw-2rem))] min-h-dvh bg-[#142c4e] border-r border-white/10 z-[60] flex flex-col transition-transform duration-300 ease-out',
          // Mobile: slide in/out based on isOpen
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: always visible, but width changes based on isCollapsed
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 flex-shrink-0">
          <Link
            to="/dashboard"
            className={cn('flex items-center gap-3 group', isCollapsed && 'lg:hidden')}
            aria-label="BuildEstate dashboard"
          >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 bg-[#c6a56b] rounded-lg flex items-center justify-center shadow-lg"
              >
                <Home className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <span className="text-base font-bold text-[#f7f5f0] tracking-tight">
                  BuildEstate
                </span>
                <div className="text-[10px] text-white/60 font-medium uppercase tracking-widest leading-none">
                  Admin Panel
                </div>
              </div>
          </Link>
          <Link
            to="/dashboard"
            className={cn('items-center justify-center w-full', !isCollapsed ? 'hidden' : 'lg:flex')}
            aria-label="BuildEstate dashboard"
          >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 bg-[#c6a56b] rounded-lg flex items-center justify-center shadow-lg"
              >
                <Home className="h-5 w-5 text-white" />
              </motion.div>
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
            aria-label="Close navigation"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#c6a56b] border-2 border-[#142c4e] rounded-full items-center justify-center text-[#142c4e] hover:bg-[#d4b583] transition-colors z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav flex-1 overflow-y-auto py-6 px-3" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255, 255, 255, 0.1) transparent'
        }}>
          {navSections.map((section, idx) => (
            <div key={section.label} className={cn(idx > 0 && 'mt-6')}>
              <div className={cn('px-3 mb-2', isCollapsed && 'lg:hidden')}>
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                    {section.label}
                  </h3>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 group border-l-2',
                      isCollapsed ? 'px-3 py-2.5 justify-center' : 'px-3 py-2.5',
                      isActive(item.path)
                        ? 'bg-white/10 border-[#c6a56b] text-white'
                        : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                    )}
                    title={isCollapsed ? item.label : ''}
                  >
                    <item.icon className={cn(
                      'h-5 w-5 flex-shrink-0 transition-colors duration-200',
                      isActive(item.path) ? 'text-[#c6a56b]' : 'text-white/70 group-hover:text-white'
                    )} />
                    <span className={cn('flex-1', isCollapsed && 'lg:hidden')}>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile & Logout */}
        <div className="border-t border-white/10 p-4 flex-shrink-0">
          {/* Notifications */}
          <div className={cn(isCollapsed && 'lg:hidden')}>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 mb-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 text-sm font-medium" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="flex-1 text-left">Notifications</span>
              <span className="h-5 w-5 bg-[#142c4e] text-white text-xs flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>
          <div className={cn('hidden items-center justify-center', isCollapsed && 'lg:flex')}>
            <button className="w-full flex items-center justify-center px-3 py-2.5 mb-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-[#142c4e] text-white text-[10px] flex items-center justify-center rounded-full">3</span>
            </button>
          </div>

          {/* Profile */}
          <div className={cn(isCollapsed && 'lg:hidden')}>
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-white/5 rounded-lg">
              <div className="h-9 w-9 bg-[#c6a56b] rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#f7f5f0] truncate">Admin</div>
                <div className="text-xs text-white/60">Administrator</div>
              </div>
            </div>
          </div>
          <div className={cn('hidden justify-center', isCollapsed && 'lg:flex')}>
            <div className="flex items-center justify-center px-3 py-2.5 mb-2 bg-white/5 rounded-lg">
              <div className="h-9 w-9 bg-[#c6a56b] rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className={cn(isCollapsed && 'lg:hidden')}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
          <div className={cn('hidden', isCollapsed && 'lg:block')}>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#0f2340]/60 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 rounded-lg border border-white/10 bg-[#142c4e] p-2.5 text-[#f7f5f0] shadow-lg lg:hidden"
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
