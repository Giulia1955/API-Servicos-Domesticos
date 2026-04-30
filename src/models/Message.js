import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceRequest", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

messageSchema.index({ request: 1, createdAt: 1 });

export const Message = mongoose.model("Message", messageSchema);
