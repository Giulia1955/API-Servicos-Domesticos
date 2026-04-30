import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      required: true,
    },
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["client", "provider"], required: true },
    bio: { type: String, default: "" },
    portfolio: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    availability: { type: [availabilitySchema], default: [] },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
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

userSchema.index({ location: "2dsphere" });

export const User = mongoose.model("User", userSchema);
