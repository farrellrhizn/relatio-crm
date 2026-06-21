import { Router } from "express";
import {
  createLeadController,
  deleteLeadController,
  getLeadByIdController,
  getLeadsController,
  updateLeadController,
} from "../controllers/lead.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createLeadController);
router.get("/", getLeadsController);
router.get("/:id", getLeadByIdController);
router.put("/:id", updateLeadController);
router.delete("/:id", deleteLeadController);

export default router;
