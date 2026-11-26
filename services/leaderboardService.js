import { CoderModel } from "../models/Coder.js";
import { SubmissionModel } from "../models/Submission.js";

/**
 * Service to fetch the leaderboard.
 * Lists all coders sorted by their score (highest to lowest),
 * with the count of solved_challenges (unique challenges correctly passed).
 * @param {number} [limit] - Optional limit for top K coders.
 */
export const getLeaderboardService = async (limit = null) => {
  // 1. Fetch coders sorted by score descending
  let query = CoderModel.find()
    .select("firstName lastName avatar score")
    .sort({ score: -1 });

  if (limit && Number.isInteger(limit) && limit > 0) {
    query = query.limit(limit);
  }

  const coders = await query;
  if (!coders || coders.length === 0) {
    return [];
  }

  const coderIds = coders.map((c) => c._id);

  // 2. Count distinct solved challenges for each coder
  const solvedStats = await SubmissionModel.aggregate([
    {
      $match: {
        coder: { $in: coderIds },
        passed: true,
      },
    },
    {
      $group: {
        _id: {
          coder: "$coder",
          challenge: "$challenge",
        },
      },
    },
    {
      $group: {
        _id: "$_id.coder",
        solvedCount: { $sum: 1 },
      },
    },
  ]);

  const solvedMap = new Map();
  solvedStats.forEach((stat) => {
    solvedMap.set(stat._id.toString(), stat.solvedCount);
  });

  // 3. Assemble response
  return coders.map((coder) => ({
    id: coder._id,
    firstName: coder.firstName,
    lastName: coder.lastName,
    name: `${coder.firstName} ${coder.lastName}`.trim(),
    avatar: coder.avatar,
    score: coder.score || 0,
    solved_challenges: solvedMap.get(coder._id.toString()) || 0,
  }));
};
