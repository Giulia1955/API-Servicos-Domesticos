import { Notification } from "../models/Notification.js";
import { asyncHandler } from "../utils/http.js";

export const listMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

export const markNotificationSeen = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { seen: true },
    { new: true }
  );
  if (!notification) {
    res.status(404).json({ message: "Notificacao nao encontrada." });
    return;
  }
  res.json(notification);
});
