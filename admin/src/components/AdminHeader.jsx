import { Bell, ChevronRight, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageLabels = {
  '/dashboard': 'Dashboard',
  '/pending-listings': 'Review Queue',
  '/list': 'All Properties',
  '/add': 'Add Property',
  '/appointments': 'Appointments',
  '/users': 'Users',
  '/activity-logs': 'Activity Logs',
  '/ai-models': 'AI Models',
};

const AdminHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const pageTitle = location.pathname.startsWith('/update/')
    ? 'Edit Property'
    : location.pathname.startsWith('/users/')
      ? 'User Details'
      : pageLabels[location.pathname] || 'Admin workspace';

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-[#e5e7eb] bg-[#f7f5f0]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#142c4e] shadow-sm hover:border-[#c6a56b] hover:bg-[#eef3f8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a56b] lg:hidden"
          aria-label="Open admin navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <div className="hidden items-center gap-1 text-xs font-medium text-[#687386] sm:flex">
            <span>Aavasa</span>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Admin</span>
          </div>
          <h1 className="truncate text-lg font-bold text-[#253247] sm:text-xl">{pageTitle}</h1>
        </div>
      </div>

      <button
        type="button"
        className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#687386] hover:border-[#c6a56b] hover:text-[#142c4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c6a56b]"
        aria-label="View notifications"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#c6a56b]" aria-hidden="true" />
      </button>
    </header>
  );
};

export default AdminHeader;
