import { Router } from "express";
import {
  validateChallenge,
  validateChallengeSubmission,
} from "../middlewares/challengeValidator.js";
import {
  createChallenge,
  getAllChallenges,
  getChallengeById,
  deleteChallengeById,
  getAllCategories,
  submitChallenge,
} from "../controllers/challengesControllers.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", authorize(["Manager"]), validateChallenge, createChallenge);
router.get("/", getAllChallenges);
router.get("/categories", getAllCategories);
router.get("/:id", getChallengeById);
router.delete("/:id", authorize(["Manager"]), deleteChallengeById);
router.post("/:id/submission", authorize(["Coder"]), validateChallengeSubmission, submitChallenge);

export default router;
