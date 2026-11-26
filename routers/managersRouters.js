import { Router } from "express";
import {
  managersRegistration,
  managersLogin,
  getManagerById,
  updateManagerById,
  deleteManagerById,
} from "../controllers/managersControllers.js";
import {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
} from "../middlewares/authValidator.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/registration", validateRegistration, managersRegistration);

router.post("/login", validateLogin, managersLogin);

router.get("/:id", authorize(), getManagerById);

router.patch("/:id", authorize(["Manager"]), validateUpdateProfile, updateManagerById);

router.delete("/:id", authorize(["Manager"]), deleteManagerById);

export default router;
