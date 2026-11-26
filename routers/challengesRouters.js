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
import { authorize, validateObjectId } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create", authorize(["Manager"]), validateChallenge, createChallenge);
router.get("/", authorize(), getAllChallenges);
router.get("/categories", getAllCategories);
router.get("/:id", authorize(), validateObjectId(), getChallengeById);
router.delete("/:id", authorize(["Manager"]), validateObjectId(), deleteChallengeById);
router.post("/:id/submission", authorize(["Coder"]), validateObjectId(), validateChallengeSubmission, submitChallenge);

export default router;
