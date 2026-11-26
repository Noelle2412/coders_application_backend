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
import { authorize, ensureSelf, validateObjectId } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/registration", validateRegistration, managersRegistration);

router.post("/login", validateLogin, managersLogin);

router.get("/:id", authorize(), validateObjectId(), getManagerById);

router.patch("/:id", authorize(["Manager"]), validateObjectId(), ensureSelf, validateUpdateProfile, updateManagerById);

router.delete("/:id", authorize(["Manager"]), validateObjectId(), ensureSelf, deleteManagerById);

export default router;
