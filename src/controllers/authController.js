import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError, asyncHandler } from "../utils/http.js";

function signToken(userId, role) {
  return jwt.sign({ role }, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, portfolio, availability, categories, location } = req.body;
  if (!name || !email || !password || !role) {
    throw new AppError(400, "Campos obrigatorios: name, email, password, role.");
  }
  if (!["client", "provider"].includes(role)) {
    throw new AppError(400, "Role deve ser client ou provider.");
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    throw new AppError(409, "Email ja cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    bio: bio || "",
    portfolio: Array.isArray(portfolio) ? portfolio : [],
    availability: Array.isArray(availability) ? availability : [],
    categories: Array.isArray(categories) ? categories : [],
    location:
      location && typeof location.lat === "number" && typeof location.lng === "number"
        ? { type: "Point", coordinates: [location.lng, location.lat] }
        : undefined,
  });

  const token = signToken(user._id, user.role);
  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(400, "Campos obrigatorios: email, password.");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    throw new AppError(401, "Credenciais invalidas.");
  }

  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError(401, "Credenciais invalidas.");
  }

  const token = signToken(user._id, user.role);
  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
