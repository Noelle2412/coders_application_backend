import { Router } from "express";
import {
  getSolvedChallengesStats,
  getTrendingCategories,
  getHeatmap,
} from "../controllers/statsControllers.js";

const router = Router();

router.get("/solved-challenges", getSolvedChallengesStats);
router.get("/trending-categories", getTrendingCategories);
router.get("/heatmap", getHeatmap);

export default router;
