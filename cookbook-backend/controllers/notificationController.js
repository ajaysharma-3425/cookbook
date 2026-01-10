import Notification from "../models/Notification.js";

export const getMyNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
};

export const markAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification)
    return res.status(404).json({ message: "Notification not found" });

  notification.isRead = true;
  await notification.save();

  res.json({ message: "Marked as read" });
};

export const deleteNotification = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification)
    return res.status(404).json({ message: "Notification not found" });

  await notification.deleteOne();
  res.json({ message: "Deleted" });
};
