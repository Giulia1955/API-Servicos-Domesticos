import { Router } from "express";
import { createReview, listProviderReviews } from "../controllers/reviewController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, authorize("client"), createReview);
router.get("/provider/:providerId", listProviderReviews);

export default router;
