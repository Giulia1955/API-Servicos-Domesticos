import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", default: null },
    type: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    seen: { type: Boolean, default: false },
    sound: { type: String, default: "default" },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, seen: 1, createdAt: -1 });

export const Notification = mongoose.model("Notification", notificationSchema);
