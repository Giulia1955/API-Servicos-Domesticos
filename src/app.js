import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { swaggerSpec } from "./config/swagger.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use((req, _res, next) => {
    req.io = req.app.locals.io;
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/requests", requestRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/chat", chatRoutes);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
