import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  getCompanyById,
  getCompanies,
  updateCompany,
} from "../controllers/company.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.post("/", createCompany);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);

export default router;
