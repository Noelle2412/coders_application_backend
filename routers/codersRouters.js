import { Router } from "express";
import {
  codersRegistration,
  codersLogin,
  getCoderById,
  updateCoderById,
  deleteCoderById,
} from "../controllers/codersControllers.js";
import {
  validateRegistration,
  validateLogin,
  validateUpdateProfile,
} from "../middlewares/authValidator.js";
import { authorize, ensureSelf, validateObjectId } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/registration", validateRegistration, codersRegistration);

router.post("/login", validateLogin, codersLogin);

router.get("/:id", authorize(), validateObjectId(), getCoderById);

router.patch("/:id", authorize(["Coder"]), validateObjectId(), ensureSelf, validateUpdateProfile, updateCoderById);

router.delete("/:id", authorize(["Coder"]), validateObjectId(), ensureSelf, deleteCoderById);

export default router;
