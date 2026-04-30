import { Notification } from "../models/Notification.js";

export async function createAndDispatchNotification(io, payload) {
  const notification = await Notification.create(payload);
  if (io) {
    io.to(`user:${String(payload.user)}`).emit("notification:new", {
      id: notification._id,
      type: notification.type,
      message: notification.message,
      request: notification.request,
      sound: notification.sound,
      createdAt: notification.createdAt,
    });
  }
  return notification;
}
