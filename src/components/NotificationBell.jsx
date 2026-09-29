import { useEffect, useRef, useState } from "react";
import { FaBell, FaMobileAlt } from "react-icons/fa";
import baseURL from "../assets/baseURL";
import { getPermissionState, subscribeToPush } from "../utils/pushNotifications";

// Site-wide notification bell. Polls the backend for the latest
// announcements (currently: "a product was just approved") and shows an
// unread badge until the dropdown is opened. Read state is tracked
// per-browser in localStorage - there's no per-user tracking on the
// backend, since these are broadcast announcements, not personal alerts.
//
// Also offers to turn these into real phone push notifications (with the
// device's default notification sound) via the Web Push API - see
// src/utils/pushNotifications.js and farmbackend's /push routes.
const LAST_SEEN_KEY = "linkpii_notifications_last_seen";
const POLL_INTERVAL_MS = 30000;

const getLastSeen = () => {
  try {
    return localStorage.getItem(LAST_SEEN_KEY);
  } catch (error) {
    return null;
  }
};

const setLastSeen = (isoString) => {
  try {
    localStorage.setItem(LAST_SEEN_KEY, isoString);
  } catch (error) {
    // Ignore - worst case the unread badge resets more often than it needs to.
  }
};

const timeAgo = (dateString) => {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [pushState, setPushState] = useState("unsupported"); // unsupported | default | granted | denied
  const [pushBusy, setPushBusy] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${baseURL}notifications-feed`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        // Silent - the bell just stays as it was until the next poll succeeds.
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setPushState(getPermissionState());
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const lastSeen = getLastSeen();
  const unreadCount = lastSeen
    ? notifications.filter((n) => new Date(n.createdAt) > new Date(lastSeen)).length
    : notifications.length;

  const handleToggle = () => {
    const opening = !isOpen;
    setIsOpen(opening);
    if (opening && notifications.length > 0) {
      setLastSeen(notifications[0].createdAt);
    }
  };

  const handleEnablePush = async () => {
    setPushBusy(true);
    try {
      const granted = await subscribeToPush();
      setPushState(granted ? "granted" : getPermissionState());
    } finally {
      setPushBusy(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative rounded-xl p-2 text-lg text-ink-600 transition-colors hover:bg-ink-50 hover:text-brand-700"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[85vw] overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card-hover">
          <div className="border-b border-ink-100 px-4 py-3">
            <p className="font-display text-sm font-bold text-ink-900">Notifications</p>
          </div>
          {pushState === "default" && (
            <div className="flex items-center gap-3 border-b border-ink-100 bg-brand-50 px-4 py-3">
              <FaMobileAlt className="shrink-0 text-lg text-brand-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-ink-800">Get these on your phone too</p>
                <p className="text-[11px] text-ink-500">With sound, even when the site isn't open.</p>
              </div>
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={pushBusy}
                className="shrink-0 rounded-lg bg-brand-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
              >
                {pushBusy ? "..." : "Enable"}
              </button>
            </div>
          )}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-400">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="border-b border-ink-50 px-4 py-3 last:border-b-0 hover:bg-ink-50"
                >
                  <p className="text-sm font-semibold text-ink-800">{notification.title}</p>
                  <p className="mt-0.5 text-sm text-ink-500">{notification.body}</p>
                  <p className="mt-1 text-xs text-ink-400">{timeAgo(notification.createdAt)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
