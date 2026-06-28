import { Router } from "express";
import {
  createOpportunity,
  deleteOpportunity,
  getOpportunityById,
  getOpportunities,
  updateOpportunity,
} from "../controllers/opportunity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getOpportunities);
router.get("/:id", getOpportunityById);
router.post("/", createOpportunity);
router.put("/:id", updateOpportunity);
router.delete("/:id", deleteOpportunity);

export default router;
