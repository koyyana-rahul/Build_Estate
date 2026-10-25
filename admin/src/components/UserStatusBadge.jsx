/**
 * UserStatusBadge Component
 *
 * Displays user status with appropriate colors and styling
 * Used in user tables, user details, and other user management interfaces
 */

const STATUS_CONFIG = {
  active: {
    label: 'Active',
    bgColor: 'bg-[#eef7f2]',
    textColor: 'text-[#287a55]',
    dotColor: 'bg-[#287a55]'
  },
  suspended: {
    label: 'Suspended',
    bgColor: 'bg-[#fbf5e8]',
    textColor: 'text-[#b7791f]',
    dotColor: 'bg-[#b7791f]'
  },
  banned: {
    label: 'Banned',
    bgColor: 'bg-[#fdf0ef]',
    textColor: 'text-[#c2413b]',
    dotColor: 'bg-[#c2413b]'
  }
};

const UserStatusBadge = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.active;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} ${className}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
};

export default UserStatusBadge;