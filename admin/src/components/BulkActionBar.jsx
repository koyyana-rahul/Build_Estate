import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Clock, Shield, Trash2 } from 'lucide-react';

/**
 * BulkActionBar Component
 *
 * Sticky bottom action bar that appears when items are selected
 * Supports different action types based on context (users vs properties)
 */
const BulkActionBar = ({
  selectedCount,
  onClearSelection,
  onSuspendAll,
  onBanAll,
  onDeleteAll,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
  context = 'users', // 'users' or 'properties'
  isVisible = false
}) => {
  if (selectedCount === 0 && !isVisible) return null;

  const userActions = [
    {
      label: 'Suspend All',
      icon: Clock,
      onClick: onSuspendAll,
      variant: 'warning',
      show: !!onSuspendAll
    },
    {
      label: 'Ban All',
      icon: Shield,
      onClick: onBanAll,
      variant: 'danger',
      show: !!onBanAll
    },
    {
      label: 'Delete All',
      icon: Trash2,
      onClick: onDeleteAll,
      variant: 'danger',
      show: !!onDeleteAll
    }
  ];

  const propertyActions = [
    {
      label: 'Approve All',
      icon: Shield,
      onClick: onBulkApprove,
      variant: 'success',
      show: !!onBulkApprove
    },
    {
      label: 'Reject All',
      icon: X,
      onClick: onBulkReject,
      variant: 'warning',
      show: !!onBulkReject
    },
    {
      label: 'Delete All',
      icon: Trash2,
      onClick: onBulkDelete,
      variant: 'danger',
      show: !!onBulkDelete
    }
  ];

  const actions = context === 'users' ? userActions : propertyActions;
  const visibleActions = actions.filter(action => action.show);

  const getButtonStyles = (variant) => {
    const base = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105";

    switch (variant) {
      case 'success':
        return `${base} bg-[#287a55] text-white hover:bg-[#216342]`;
      case 'warning':
        return `${base} bg-[#b7791f] text-white hover:bg-[#965f16]`;
      case 'danger':
        return `${base} bg-[#c2413b] text-white hover:bg-[#a93530]`;
      default:
        return `${base} bg-[#142c4e] text-white hover:bg-[#0f2340]`;
    }
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl p-4">
            <div className="flex items-center gap-4">
              {/* Selection Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#142c4e]/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#142c4e]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#253247]">
                    {selectedCount} {context === 'users' ? 'user' : 'item'}{selectedCount !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-[#687386]">
                    Choose an action to perform on all selected items
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {visibleActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className={getButtonStyles(action.variant)}
                    >
                      <Icon className="w-4 h-4" />
                      {action.label}
                    </button>
                  );
                })}

                {/* Clear Selection */}
                <button
                  onClick={onClearSelection}
                  className="p-2.5 border border-[#e5e7eb] text-[#687386] rounded-xl hover:bg-[#f7f5f0] transition-colors"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActionBar;