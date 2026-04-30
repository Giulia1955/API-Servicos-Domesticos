import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { AppError, asyncHandler } from "../utils/http.js";

export const authenticate = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    throw new AppError(401, "Token ausente.");
  }

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError(401, "Token invalido.");
  }

  const user = await User.findById(payload.sub).select("-passwordHash");
  if (!user) {
    throw new AppError(401, "Usuario nao encontrado.");
  }

  req.user = user;
  next();
});

export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(403, "Acesso negado."));
      return;
    }
    next();
  };
}
