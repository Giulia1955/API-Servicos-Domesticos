import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    pricingType: { type: String, enum: ["hourly", "fixed"], required: true },
    price: { type: Number, required: true, min: 0 },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

serviceSchema.index({ location: "2dsphere" });
serviceSchema.index({ category: 1, pricingType: 1, price: 1 });

export const Service = mongoose.model("Service", serviceSchema);
