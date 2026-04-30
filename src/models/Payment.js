import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true, unique: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    gateway: { type: String, default: "simulated-gateway" },
    status: { type: String, enum: ["simulated_paid", "simulated_failed"], required: true },
    reference: { type: String, required: true },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
