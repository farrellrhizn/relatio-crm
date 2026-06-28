import { Router } from "express";
import {
  getDashboardDataController,
  getNotificationsController,
  markNotificationsAsReadController,
  searchGlobalController,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getDashboardDataController);
router.get("/search", searchGlobalController);
router.get("/notifications", getNotificationsController);
router.put("/notifications/read", markNotificationsAsReadController);

export default router;
