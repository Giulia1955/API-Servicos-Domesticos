import { Router } from "express";
import {
  listMessagesByRequest,
  sendMessageByRequest,
} from "../controllers/chatController.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.get("/requests/:requestId/messages", authenticate, listMessagesByRequest);
router.post("/requests/:requestId/messages", authenticate, sendMessageByRequest);

export default router;
