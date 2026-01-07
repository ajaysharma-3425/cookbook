import api from "./axios";

export const getNotifications = () => api.get("/notifications");
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

// ✅ ADD THIS FUNCTION - Delete all notifications
export const deleteAllNotifications = () => api.delete("/notifications");

// ✅ OPTIONAL: Add markAllNotificationsRead if needed
export const markAllNotificationsRead = () => api.put("/notifications/mark-all-read");