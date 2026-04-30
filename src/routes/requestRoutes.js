import { Router } from "express";
import {
  createRequest,
  listMyRequests,
  updateRequestStatus,
} from "../controllers/requestController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, authorize("client"), createRequest);
router.get("/me", authenticate, listMyRequests);
router.patch("/:id/status", authenticate, updateRequestStatus);

export default router;
