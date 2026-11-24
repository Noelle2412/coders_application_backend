import { ChallengeModel } from "../models/Challenge.js";

export const createChallenge = async (req, res) => {
  try {
    const challenge = await ChallengeModel.create(req.body);
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
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    const challenges = await ChallengeModel.find(filter);
    res.status(200).json({
      status: "success",
      message: "Challenges retrieved successfully",
      data: challenges,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving challenges",
      error: error.message,
    });
  }
};

export const getChallengeById = async (req, res) => {
  try {
    const challenge = await ChallengeModel.findById(req.params.id);
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
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the challenge",
      error: error.message,
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
    const categories = await ChallengeModel.distinct("category");
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
    const { lang, code, challenge_id } = req.body;
    const challenge = await ChallengeModel.findById(challenge_id);
    if (!challenge) {
      return res.status(404).json({
        status: "error",
        message: "Challenge not found",
      });
    }
    // Simulation of test execution
    res.status(200).json({
      status: "success",
      message: "Challenge submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "An error occurred while submitting the challenge",
      error: error.message,
    });
  }
};
