import { Router } from "express";
import {
  createActivityController,
  deleteActivityController,
  getActivitiesController,
  getActivityByIdController,
  updateActivityController,
} from "../controllers/activity.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createActivityController);
router.get("/", getActivitiesController);
router.get("/:id", getActivityByIdController);
router.put("/:id", updateActivityController);
router.delete("/:id", deleteActivityController);

export default router;
