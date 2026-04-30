import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    details: { type: String, default: "" },
    scheduledAt: { type: Date, default: null },
    priceSnapshot: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

requestSchema.index({ client: 1, createdAt: -1 });
requestSchema.index({ provider: 1, createdAt: -1 });

export const ServiceRequest = mongoose.model("ServiceRequest", requestSchema);
