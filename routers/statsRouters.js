import { Router } from "express";
import {
  getSolvedChallengesStats,
  getTrendingCategories,
  getHeatmap,
} from "../controllers/statsControllers.js";
import { authorize } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/solved-challenges", authorize(["Coder"]), getSolvedChallengesStats);
router.get("/trending-categories", authorize(["Coder"]), getTrendingCategories);
router.get("/heatmap", authorize(["Coder"]), getHeatmap);

export default router;
