import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { geocodeAddress } from "../utils/geocode.js";
import { AppError, asyncHandler } from "../utils/http.js";

function signToken(userId, role) {
  return jwt.sign({ role }, env.jwtSecret, {
    subject: String(userId),
    expiresIn: env.jwtExpiresIn,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, portfolio, availability, categories, location, address } = req.body;
  if (!name || !email || !password || !role) {
    throw new AppError(400, "Campos obrigatorios: name, email, password, role.");
  }
  if (!["client", "provider"].includes(role)) {
    throw new AppError(400, "Role deve ser client ou provider.");
  }
  if (role === "client" && (!address || typeof address !== "string" || address.trim().length === 0)) {
    throw new AppError(400, "Clientes devem informar o endereco completo.");
  }

  const existing = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (existing) {
    throw new AppError(409, "Email ja cadastrado.");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // If address provided but no explicit location, try to geocode it
  let resolvedLocation = undefined;
  if (
    location && typeof location.lat === "number" && typeof location.lng === "number"
  ) {
    resolvedLocation = { type: "Point", coordinates: [location.lng, location.lat] };
  } else if (address && typeof address === "string" && address.trim().length > 0) {
    const geo = await geocodeAddress(address);
    if (geo) resolvedLocation = { type: "Point", coordinates: [geo.lng, geo.lat] };
  }

  const user = await User.create({
    name,
    email,
    passwordHash,
    role,
    bio: bio || "",
    portfolio: Array.isArray(portfolio) ? portfolio : [],
    availability: Array.isArray(availability) ? availability : [],
    categories: Array.isArray(categories) ? categories : [],
    address: address || "",
    location: resolvedLocation,
  });

  const token = signToken(user._id, user.role);
  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || "",
      location:
        user.location && Array.isArray(user.location.coordinates)
          ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] }
          : null,
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
      address: user.address || "",
      location:
        user.location && Array.isArray(user.location.coordinates)
          ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] }
          : null,
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    address: req.user.address || "",
    location:
      req.user.location && Array.isArray(req.user.location.coordinates)
        ? { lat: req.user.location.coordinates[1], lng: req.user.location.coordinates[0] }
        : null,
  });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { address, location } = req.body;
  const user = req.user;
  let changed = false;
  if (typeof address === "string") {
    user.address = address;
    changed = true;
  }
  if (location && typeof location.lat === "number" && typeof location.lng === "number") {
    user.location = { type: "Point", coordinates: [location.lng, location.lat] };
    changed = true;
  }
  if (changed) await user.save();

  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address || "",
      location:
        user.location && Array.isArray(user.location.coordinates)
          ? { lat: user.location.coordinates[1], lng: user.location.coordinates[0] }
          : null,
    },
  });
});
