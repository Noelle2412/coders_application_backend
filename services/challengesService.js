import { ChallengeModel } from "../models/Challenge.js";
import { SubmissionModel } from "../models/Submission.js";
import mongoose from "mongoose";

/**
 * Calculates solution rate and coder status for a list of challenges or a single challenge.
 * Solution rate = (number of unique coders who solved it / total unique coders who attempted it) * 100
 */
export const enhanceChallengeData = async (challenges, user) => {
  const isArray = Array.isArray(challenges);
  const challengeList = isArray ? challenges : [challenges];

  if (challengeList.length === 0) {
    return isArray ? [] : null;
  }

  const challengeIds = challengeList.map((c) => c._id);

  // 1. Compute solution_rate for each challenge
  const submissionStats = await SubmissionModel.aggregate([
    {
      $match: {
        challenge: { $in: challengeIds },
      },
    },
    {
      $group: {
        _id: {
          challenge: "$challenge",
          coder: "$coder",
        },
        hasPassed: {
          $max: "$passed",
        },
      },
    },
    {
      $group: {
        _id: "$_id.challenge",
        totalAttemptedCoders: { $sum: 1 },
        totalSolvedCoders: {
          $sum: { $cond: [{ $eq: ["$hasPassed", true] }, 1, 0] },
        },
      },
    },
  ]);

  const statsMap = new Map();
  submissionStats.forEach((stat) => {
    const rate =
      stat.totalAttemptedCoders > 0
        ? Math.round(
            (stat.totalSolvedCoders / stat.totalAttemptedCoders) * 100,
          )
        : 0;
    statsMap.set(stat._id.toString(), {
      solution_rate: rate,
      total_attempted_coders: stat.totalAttemptedCoders,
      total_solved_coders: stat.totalSolvedCoders,
    });
  });

  // 2. Compute status if user is a coder
  const userSubmissionsMap = new Map();
  if (user && user.role === "coder") {
    const userCoderId = new mongoose.Types.ObjectId(user.id);
    const userSubmissions = await SubmissionModel.aggregate([
      {
        $match: {
          challenge: { $in: challengeIds },
          coder: userCoderId,
        },
      },
      {
        $group: {
          _id: "$challenge",
          hasPassed: { $max: "$passed" },
          attemptCount: { $sum: 1 },
        },
      },
    ]);

    userSubmissions.forEach((sub) => {
      userSubmissionsMap.set(sub._id.toString(), {
        hasPassed: sub.hasPassed,
        attemptCount: sub.attemptCount,
      });
    });
  }

  // 3. Format results
  const formatted = challengeList.map((c) => {
    const doc = c.toObject ? c.toObject() : { ...c };
    const cId = doc._id.toString();

    const stats = statsMap.get(cId) || {
      solution_rate: 0,
      total_attempted_coders: 0,
      total_solved_coders: 0,
    };
    doc.solution_rate = stats.solution_rate;

    if (user && user.role === "coder") {
      const userSub = userSubmissionsMap.get(cId);
      if (!userSub || userSub.attemptCount === 0) {
        doc.status = "Waiting";
      } else if (userSub.hasPassed) {
        doc.status = "Completed";
      } else {
        doc.status = "Attempted";
      }
    }

    return doc;
  });

  return isArray ? formatted : formatted[0];
};

/**
 * Service to list all challenges based on requester role and filters.
 */
export const listChallengesService = async (user, query = {}) => {
  const filter = {};

  if (query.category) {
    filter.category = query.category;
  }

  // If requester is a manager, display only challenges created by them
  if (user && user.role === "manager") {
    filter.manager = user.id;
  }

  const challenges = await ChallengeModel.find(filter)
    .populate("manager", "firstName lastName email avatar")
    .sort({ createdAt: -1 });

  return await enhanceChallengeData(challenges, user);
};

/**
 * Service to get a challenge by ID based on requester role and status.
 */
export const getChallengeByIdService = async (id, user) => {
  const challenge = await ChallengeModel.findById(id).populate(
    "manager",
    "firstName lastName email avatar",
  );

  if (!challenge) {
    return null;
  }

  // If manager, check if they own the challenge
  if (user && user.role === "manager") {
    const managerId = challenge.manager?._id?.toString() || challenge.manager?.toString();
    if (managerId !== user.id) {
      const error = new Error("Access forbidden: you can only view your own challenges.");
      error.statusCode = 403;
      throw error;
    }
  }

  return await enhanceChallengeData(challenge, user);
};

/**
 * Service to fetch all distinct challenge categories from the database.
 */
export const getAllCategoriesService = async () => {
  const categories = await ChallengeModel.distinct("category");
  // Filter out any empty strings or nulls and sort alphabetically
  return categories.filter(Boolean).sort();
};
