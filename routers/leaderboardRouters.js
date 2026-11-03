import { Router } from "express";
import {
  getLeaderboard,
  getTopCoders,
} from "../controllers/leaderboardControllers.js";

const router = Router();

router.get("/", getLeaderboard);
router.get("/top", getTopCoders);

export default router;
