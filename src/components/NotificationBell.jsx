import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../api/notificationApi";
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  ExternalLink,
  AlertCircle,
  ThumbsUp,
  ChefHat,
  Eye,
  MessageSquare,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();
  const navigate = useNavigate();

  // Notification type icons mapping
  const notificationIcons = {
    recipe_approved: <ThumbsUp className="h-4 w-4 text-green-500" />,
    recipe_rejected: <AlertCircle className="h-4 w-4 text-red-500" />,
    recipe_pending: <Clock className="h-4 w-4 text-orange-500" />,
    comment_added: <MessageSquare className="h-4 w-4 text-blue-500" />,
    new_follower: <Eye className="h-4 w-4 text-purple-500" />,
    default: <ChefHat className="h-4 w-4 text-gray-500" />
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UNREAD COUNT ================= */
  const unreadCount = notifications.filter(n => !n.isRead).length;

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handler = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= NOTIFICATION CLICK ================= */
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markNotificationRead(notification._id);
        setNotifications(prev =>
          prev.map(item =>
            item._id === notification._id ? { ...item, isRead: true } : item
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    setOpen(false);
    
    // Navigate to the notification link if it exists
    if (notification.link) {
      navigate(notification.link);
    }
  };

  /* ================= MARK ALL AS READ ================= */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  /* ================= DELETE NOTIFICATION ================= */
  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(item => item._id !== notificationId)
      );
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  /* ================= DELETE ALL NOTIFICATIONS ================= */
  const handleDeleteAll = async () => {
    if (notifications.length === 0) return;
    
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      try {
        await deleteAllNotifications();
        setNotifications([]);
        toast.success("All notifications cleared");
      } catch (error) {
        toast.error("Failed to clear notifications");
      }
    }
  };

  /* ================= FORMAT TIME ================= */
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  /* ================= TOAST NEW NOTIFICATIONS ================= */
  useEffect(() => {
    if (notifications.length > 0) {
      const latestUnread = notifications.find(n => !n.isRead);
      if (latestUnread) {
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
            max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  {notificationIcons[latestUnread.type] || notificationIcons.default}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {latestUnread.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {latestUnread.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => {
                  handleNotificationClick(latestUnread);
                  toast.dismiss(t.id);
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-orange-600 hover:text-orange-500 focus:outline-none"
              >
                View
              </button>
            </div>
          </div>
        ), {
          duration: 4000,
          position: 'top-right',
        });
      }
    }
  }, [notifications]);

  return (
    <div className="relative" ref={boxRef}>
      {/* 🔔 Notification Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        aria-label={`${unreadCount} unread notifications`}
      >
        <Bell className="h-5 w-5 text-gray-600 hover:text-orange-600 transition-colors" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* 📥 Notifications Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="py-8 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                <p className="mt-3 text-gray-500">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-700 mb-2">No notifications</h4>
                <p className="text-sm text-gray-500">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`p-2 rounded-lg ${
                          !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          {notificationIcons[notification.type] || notificationIcons.default}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteNotification(notification._id, e)}
                            className="p-1 hover:bg-gray-200 rounded-lg transition-colors ml-2 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.createdAt)}
                          </span>
                          
                          {notification.link && (
                            <button className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                              View
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleDeleteAll}
                  className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </button>
                <button
                  onClick={() => navigate("/notifications")}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}