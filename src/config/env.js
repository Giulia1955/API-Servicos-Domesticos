import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3000),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local-services",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};
