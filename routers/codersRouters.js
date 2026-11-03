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
} from "../middlewares/authValidator.js";

const router = Router();

router.post("/registration", validateRegistration, codersRegistration);

router.post("/login", validateLogin, codersLogin);

router.get("/:id", getCoderById);

router.patch("/:id", updateCoderById);

router.delete("/:id", deleteCoderById);

export default router;
