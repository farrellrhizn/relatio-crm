import { Router } from "express";
import {
  createProposal,
  deleteProposal,
  getProposalById,
  getProposals,
  updateProposal,
} from "../controllers/proposal.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getProposals);
router.get("/:id", getProposalById);
router.post("/", createProposal);
router.put("/:id", updateProposal);
router.delete("/:id", deleteProposal);

export default router;
