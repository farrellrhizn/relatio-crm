import { Router } from "express";
import { getDashboardDataController } from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getDashboardDataController);

export default router;
