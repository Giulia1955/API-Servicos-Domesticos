import { Router } from "express";
import {
  listMyNotifications,
  markNotificationSeen,
} from "../controllers/notificationController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/me", authenticate, listMyNotifications);
router.patch("/:id/seen", authenticate, markNotificationSeen);

export default router;
