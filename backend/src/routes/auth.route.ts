import { Router } from "express";
import { login, me, register } from "../controllers/auth.controller";
import { changePassword } from "../controllers/changePassword.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);
router.put("/change-password", authMiddleware, changePassword);

export default router;
