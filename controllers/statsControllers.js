import {
  getSolvedChallengesStatsService,
  getTrendingCategoriesService,
  getHeatmapService,
} from "../services/statsService.js";

export const getSolvedChallengesStats = async (req, res) => {
  try {
    const coderId = req.user?.id;
    if (!coderId) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required to view coder statistics.",
      });
    }

    const stats = await getSolvedChallengesStatsService(coderId);
    res.status(200).json({
      status: "success",
      message: "Solved challenges stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving solved challenges stats",
      error: error.message,
    });
  }
};

export const getTrendingCategories = async (req, res) => {
  try {
    const trendingCategories = await getTrendingCategoriesService();
    res.status(200).json({
      status: "success",
      message: "Trending categories retrieved successfully",
      data: trendingCategories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving trending categories",
      error: error.message,
    });
  }
};

export const getHeatmap = async (req, res) => {
  try {
    const coderId = req.user?.id;
    if (!coderId) {
      return res.status(401).json({
        status: "fail",
        message: "Authentication required to view heatmap data.",
      });
    }

    const { start_date, end_date, startDate, endDate } = req.query;
    const fromDate = start_date || startDate;
    const toDate = end_date || endDate;

    const heatmapData = await getHeatmapService(coderId, fromDate, toDate);

    res.status(200).json({
      status: "success",
      message: "Heatmap data retrieved successfully",
      data: heatmapData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving heatmap data",
      error: error.message,
    });
  }
};
