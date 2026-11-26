import { getLeaderboardService } from "../services/leaderboardService.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboardData = await getLeaderboardService();

    res.status(200).json({
      status: "success",
      message: "Leaderboard retrieved successfully",
      data: leaderboardData,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the leaderboard",
      error: error.message,
    });
  }
};

export const getTopCoders = async (req, res) => {
  try {
    const K = req.query.K ? parseInt(req.query.K, 10) : 3;

    const topCoders = await getLeaderboardService(K);

    res.status(200).json({
      status: "success",
      message: "Top coders retrieved successfully",
      data: topCoders,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the top coders",
      error: error.message,
    });
  }
};
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the top coders",
      error: error.message,
    });
  }
};
