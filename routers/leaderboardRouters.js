import { Router } from "express";
import {
  getLeaderboard,
  getTopCoders,
} from "../controllers/leaderboardControllers.js";
import { validateTopCodersQuery } from "../middlewares/leaderboardValidator.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authorize(["Coder"]), getLeaderboard);
router.get("/top", authorize(["Coder"]), validateTopCodersQuery, getTopCoders);

export default router;
