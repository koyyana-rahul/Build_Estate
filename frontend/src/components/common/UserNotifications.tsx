import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, Check, ClipboardList, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentsAPI, userListingsAPI } from '../../services/api';

const VIEWED_KEY = 'buildestate_notifications_viewed';

type UserNotificationsProps = {
  compact?: boolean;
};

const UserNotifications: React.FC<UserNotificationsProps> = ({ compact = true }) => {
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState<Array<Record<string, any>>>([]);
  const [listings, setListings] = useState<Array<Record<string, any>>>([]);
  const [viewedCount, setViewedCount] = useState(() => Number(localStorage.getItem(VIEWED_KEY) || 0));

  const loadNotifications = useCallback(async () => {
    const [appointmentsResult, listingsResult] = await Promise.allSettled([
      appointmentsAPI.getByUser(),
      userListingsAPI.getMyListings(),
    ]);

    if (appointmentsResult.status === 'fulfilled') {
      setAppointments(appointmentsResult.value.data.appointments ?? []);
    }
    if (listingsResult.status === 'fulfilled') {
      const data = listingsResult.value.data;
      setListings(data.properties ?? data.listings ?? data ?? []);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 90000);
    const onFocus = () => loadNotifications();
    window.addEventListener('focus', onFocus);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', onFocus);
    };
  }, [loadNotifications]);

  const notifications = useMemo(() => {
    const items = appointments
      .filter((appointment) => ['confirmed', 'cancelled', 'completed'].includes(appointment.status))
      .slice(0, 5)
      .map((appointment) => ({
        id: `appointment-${appointment._id}`,
        label: `Viewing ${appointment.status}`,
        detail: appointment.propertyId?.title || 'Your property appointment',
        to: '/dashboard',
        icon: CalendarDays,
      }));

    listings
      .filter((listing) => ['active', 'rejected', 'expired'].includes(listing.status))
      .slice(0, 5)
      .forEach((listing) => {
        items.push({
          id: `listing-${listing._id}`,
          label: listing.status === 'active' ? 'Listing approved' : `Listing ${listing.status}`,
          detail: listing.title || 'Your property listing',
          to: '/my-listings',
          icon: ClipboardList,
        });
      });

    return items.slice(0, 8);
  }, [appointments, listings]);

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
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={open}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground-soft hover:border-primary hover:text-primary transition-colors"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Notifications</h2>
              <p className="text-xs text-muted-foreground">{notifications.length ? `${notifications.length} updates` : 'No new updates'}</p>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-primary" aria-label="Mark all notifications read">
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Close notifications">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {notifications.length ? notifications.map(({ id, label, detail, to, icon: Icon }) => (
              <Link key={id} to={to} onClick={() => setOpen(false)} className="flex items-start gap-3 rounded-lg px-3 py-3 hover:bg-muted">
                <span className="mt-0.5 rounded-lg bg-muted p-2 text-primary"><Icon className="h-4 w-4" /></span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-foreground">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">{detail}</span>
                </span>
              </Link>
            )) : <p className="px-3 py-8 text-center text-sm text-muted-foreground">You’re all caught up.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
