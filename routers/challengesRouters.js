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

const router = Router();

router.post("/create", validateChallenge, createChallenge);
router.get("/", getAllChallenges);
router.get("/categories", getAllCategories);
router.get("/:id", getChallengeById);
router.delete("/:id", deleteChallengeById);
router.post("/:id/submit", validateChallengeSubmission, submitChallenge);

export default router;
