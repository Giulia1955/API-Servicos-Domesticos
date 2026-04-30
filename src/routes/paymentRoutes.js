import { Router } from "express";
import { simulatePayment } from "../controllers/paymentController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.post("/simulate", authenticate, authorize("client"), simulatePayment);

export default router;
