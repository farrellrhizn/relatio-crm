import { Router } from "express";
import {
  createCustomerController,
  deleteCustomerController,
  getCustomerByIdController,
  getCustomersController,
  updateCustomerController,
} from "../controllers/customer.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createCustomerController);
router.get("/", getCustomersController);
router.get("/:id", getCustomerByIdController);
router.put("/:id", updateCustomerController);
router.delete("/:id", deleteCustomerController);

export default router;
