import { CoderModel } from "../models/Coder.js";

export const getLeaderboard = async (req, res) => {
  try {
    const coders = await CoderModel.find()
      .select("firstName lastName score")
      .sort({ score: -1 });

    const leaderboardData = coders.map((coder) => ({
      id: coder._id,
      name: `${coder.firstName} ${coder.lastName}`.trim(),
      score: coder.score || 0,
    }));

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

    const coders = await CoderModel.find()
      .select("firstName lastName score")
      .sort({ score: -1 })
      .limit(K);

    const topCoders = coders.map((coder) => ({
      id: coder._id,
      name: `${coder.firstName} ${coder.lastName}`.trim(),
      score: coder.score || 0,
    }));

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
