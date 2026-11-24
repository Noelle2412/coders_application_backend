import { Router } from "express";
import {
  getLeaderboard,
  getTopCoders,
} from "../controllers/leaderboardControllers.js";
import { validateTopCodersQuery } from "../middlewares/leaderboardValidator.js";

const router = Router();

router.get("/", getLeaderboard);
router.get("/top", validateTopCodersQuery, getTopCoders);

export default router;
