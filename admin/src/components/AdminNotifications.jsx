import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Check, ClipboardList, CalendarDays, X } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../services/apiClient";

const VIEWED_KEY = "aavasa_admin_notifications_viewed";

const AdminNotifications = ({ compact = false }) => {
  const [open, setOpen] = useState(false);
  const [pendingListings, setPendingListings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [viewedCount, setViewedCount] = useState(() => Number(localStorage.getItem(VIEWED_KEY) || 0));

  const loadNotifications = useCallback(async () => {
    const [pendingResult, appointmentsResult] = await Promise.allSettled([
      apiClient.get("/api/admin/properties/pending?limit=10"),
      apiClient.get("/api/appointments/all"),
    ]);

    if (pendingResult.status === "fulfilled") {
      const data = pendingResult.value.data;
      setPendingListings(data.properties || data.listings || []);
    }
    if (appointmentsResult.status === "fulfilled") {
      setAppointments(appointmentsResult.value.data.appointments || []);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 60000);
    const onFocus = () => loadNotifications();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [loadNotifications]);

  const notifications = useMemo(() => {
    const items = pendingListings.slice(0, 5).map((listing) => ({
      id: `listing-${listing._id}`,
      label: "Listing needs review",
      detail: listing.title || "New property submission",
      to: "/pending-listings",
      icon: ClipboardList,
    }));
    appointments
      .filter((appointment) => appointment.status === "pending")
      .slice(0, 5)
      .forEach((appointment) => {
        items.push({
          id: `appointment-${appointment._id}`,
          label: "Appointment needs attention",
          detail: appointment.propertyId?.title || "New viewing request",
          to: "/appointments",
          icon: CalendarDays,
        });
      });
    return items.slice(0, 8);
  }, [appointments, pendingListings]);

  const unreadCount = Math.max(0, notifications.length - viewedCount);

  const markAllRead = () => {
    setViewedCount(notifications.length);
    localStorage.setItem(VIEWED_KEY, String(notifications.length));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        className={compact
          ? "relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[#687386] hover:border-[#c6a56b] hover:text-[#142c4e]"
          : "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white"}
      >
        <Bell className="h-5 w-5" />
        {!compact && <span className="flex-1 text-left">Notifications</span>}
        {unreadCount > 0 && (
          <span className={compact
            ? "absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#142c4e] px-1 text-[10px] font-bold text-white"
            : "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#142c4e] px-1 text-xs text-white"}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={compact
          ? "absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xl"
          : "absolute bottom-full left-0 z-50 mb-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xl"}
        >
          <div className="flex items-center justify-between border-b border-[#eef0f2] px-4 py-3">
            <div>
              <h2 className="text-sm font-bold text-[#253247]">Notifications</h2>
              <p className="text-xs text-[#687386]">{notifications.length ? `${notifications.length} items needing attention` : "You're all caught up"}</p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="rounded-lg p-2 text-[#687386] hover:bg-[#f7f5f0] hover:text-[#142c4e]" aria-label="Mark all notifications read">
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-[#687386] hover:bg-[#f7f5f0]" aria-label="Close notifications">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {notifications.length ? notifications.map(({ id, label, detail, to, icon: Icon }) => (
              <Link key={id} to={to} onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-[#f7f5f0]">
                <span className="mt-0.5 rounded-lg bg-[#eef3f8] p-2 text-[#142c4e]"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#253247]">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-[#687386]">{detail}</span>
                </span>
              </Link>
            )) : <p className="px-3 py-8 text-center text-sm text-[#687386]">No new notifications.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
