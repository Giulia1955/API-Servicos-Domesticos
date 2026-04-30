import { Router } from "express";
import {
  createService,
  deleteService,
  getServiceById,
  listServices,
  updateService,
} from "../controllers/serviceController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();

router.get("/", listServices);
router.get("/:id", getServiceById);
router.post("/", authenticate, authorize("provider"), createService);
router.patch("/:id", authenticate, authorize("provider"), updateService);
router.delete("/:id", authenticate, authorize("provider"), deleteService);

export default router;
