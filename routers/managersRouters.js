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
} from "../middlewares/authValidator.js";

const router = Router();

router.post("/registration", validateRegistration, managersRegistration);

router.post("/login", validateLogin, managersLogin);

router.get("/:id", getManagerById);

router.patch("/:id", updateManagerById);

router.delete("/:id", deleteManagerById);

export default router;
