import mongoose from "mongoose";
import { ChallengeModel } from "../models/Challenge.js";
import { SubmissionModel } from "../models/Submission.js";

/**
 * 1. Solved Challenges Statistics Service:
 * Returns the total number of challenges available per difficulty level
 * and the number of challenges correctly solved by the requesting coder per level.
 * Expected format:
 * {
 *   "totalEasySolvedChallenges": 10,
 *   "totalModerateSolvedChallenges": 2,
 *   "totalHardSolvedChallenges": 1,
 *   "totalEasyChallenges": 111,
 *   "totalModerateChallenges": 40,
 *   "totalHardChallenges": 5
 * }
 */
export const getSolvedChallengesStatsService = async (coderId) => {
  const userCoderId = new mongoose.Types.ObjectId(coderId);

  // Total challenges available on platform by level
  const totalByLevel = await ChallengeModel.aggregate([
    {
      $group: {
        _id: "$level",
        count: { $sum: 1 },
      },
    },
  ]);

  const levelTotals = {
    Easy: 0,
    Moderate: 0,
    Hard: 0,
  };

  totalByLevel.forEach((item) => {
    if (levelTotals[item._id] !== undefined) {
      levelTotals[item._id] = item.count;
    }
  });

  // Unique solved challenges by difficulty level for this coder
  const solvedByLevel = await SubmissionModel.aggregate([
    {
      $match: {
        coder: userCoderId,
        passed: true,
      },
    },
    // Distinct coder + challenge to avoid counting repeat submissions
    {
      $group: {
        _id: "$challenge",
      },
    },
    // Join with challenges to get challenge level
    {
      $lookup: {
        from: "challenges",
        localField: "_id",
        foreignField: "_id",
        as: "challengeDoc",
      },
    },
    {
      $unwind: "$challengeDoc",
    },
    {
      $group: {
        _id: "$challengeDoc.level",
        count: { $sum: 1 },
      },
    },
  ]);

  const solvedTotals = {
    Easy: 0,
    Moderate: 0,
    Hard: 0,
  };

  solvedByLevel.forEach((item) => {
    if (solvedTotals[item._id] !== undefined) {
      solvedTotals[item._id] = item.count;
    }
  });

  return {
    totalEasySolvedChallenges: solvedTotals.Easy,
    totalModerateSolvedChallenges: solvedTotals.Moderate,
    totalHardSolvedChallenges: solvedTotals.Hard,
    totalEasyChallenges: levelTotals.Easy,
    totalModerateChallenges: levelTotals.Moderate,
    totalHardChallenges: levelTotals.Hard,
  };
};

/**
 * 2. Trending Categories Statistics Service:
 * Uses an aggregation pipeline:
 * - Match only passed submissions.
 * - Lookup challenge document.
 * - Unwind challenge.
 * - Group by category and cumulate count.
 * - Sort descending by count.
 * - Project category and count.
 */
export const getTrendingCategoriesService = async () => {
  const trending = await SubmissionModel.aggregate([
    {
      $match: {
        passed: true,
      },
    },
    {
      $lookup: {
        from: "challenges",
        localField: "challenge",
        foreignField: "_id",
        as: "challengeDoc",
      },
    },
    {
      $unwind: "$challengeDoc",
    },
    {
      $group: {
        _id: "$challengeDoc.category",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
  ]);

  return trending;
};

/**
 * 3. Heatmap Service:
 * Returns submission strikes by date within [startDate, endDate].
 * Formats date as YYYY/mm/dd.
 */
export const getHeatmapService = async (coderId, startDateQuery, endDateQuery) => {
  const userCoderId = new mongoose.Types.ObjectId(coderId);

  let endDate = endDateQuery ? new Date(endDateQuery) : new Date();
  let startDate = startDateQuery
    ? new Date(startDateQuery)
    : new Date(new Date().setFullYear(new Date().getFullYear() - 1));

  // Ensure valid dates
  if (isNaN(startDate.getTime())) {
    startDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  }
  if (isNaN(endDate.getTime())) {
    endDate = new Date();
  }

  const heatmap = await SubmissionModel.aggregate([
    {
      $match: {
        coder: userCoderId,
        passed: true,
        submittedAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $addFields: {
        date: {
          $dateToString: {
            format: "%Y/%m/%d",
            date: "$submittedAt",
          },
        },
      },
    },
    {
      $group: {
        _id: "$date",
        count: { $sum: 1 },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
  ]);

  return heatmap;
};
