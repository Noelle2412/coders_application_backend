import { ChallengeModel } from "../models/Challenge.js";
import { SubmissionModel } from "../models/Submission.js";
import {
  listChallengesService,
  getChallengeByIdService,
  getAllCategoriesService,
} from "../services/challengesService.js";

export const createChallenge = async (req, res) => {
  try {
    const managerId = req.user?.id || req.body.manager;

    const challenge = await ChallengeModel.create({
      ...req.body,
      ...(managerId && { manager: managerId }),
    });

    res.status(201).json({
      status: "success",
      message: "Challenge created successfully",
      data: challenge,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while creating the challenge",
      error: error.message,
    });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await listChallengesService(req.user, req.query);
    res.status(200).json({
      status: "success",
      message: "Challenges retrieved successfully",
      data: challenges,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "An error occurred while retrieving challenges",
    });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const challenge = await getChallengeByIdService(req.params.id, req.user);
    if (!challenge) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Challenge retrieved successfully",
      data: challenge,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      status: "error",
      message: error.message || "An error occurred while retrieving the challenge",
    });
  }
};

export const deleteChallengeById = async (req, res) => {
  try {
    const deletedChallenge = await ChallengeModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedChallenge) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the challenge",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesService();
    res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving categories",
      error: error.message,
    });
  }
};

export const submitChallenge = async (req, res) => {
  try {
    const challengeId = req.params.id || req.body.challenge_id;
    const { lang, code } = req.body;

    const challenge = await ChallengeModel.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }

    // Get coder id from authenticated user (req.user is injected by authMiddleware)
    const coderId = req.user?.id || req.body.coder_id;

    if (!coderId) {
      return res.status(401).json({
        status: "error",
        message: "User authentication required to submit a challenge",
      });
    }

    // Create and save submission record
    const submission = await SubmissionModel.create({
      coder: coderId,
      challenge: challenge._id,
      code,
      language: lang,
      passed: true, // Simulation of test execution
      score: 100,
      submittedAt: new Date(),
    });

    res.status(201).json({
      status: "success",
      message: "Challenge submitted successfully",
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while submitting the challenge",
      error: error.message,
    });
  }
};
