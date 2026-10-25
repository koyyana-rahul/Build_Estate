import { ChevronRight, Menu } from 'lucide-react';
import AdminNotifications from './AdminNotifications';

const AdminHeader = ({ onMenuClick }) => {
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
        <div className="flex min-w-0 items-center gap-1 text-sm font-semibold text-[#253247]">
          <span>Aavasa</span>
          <ChevronRight className="h-4 w-4 text-[#687386]" aria-hidden="true" />
          <span className="text-[#687386]">Admin</span>
        </div>
      </div>

      <AdminNotifications compact />
    </header>
  );
};

export default AdminHeader;
