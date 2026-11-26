import { CoderModel } from "../models/Coder.js";
import { ManagerModel } from "../models/Manager.js";

/**
 * Service to get a user profile.
 * - Both managers and coders are allowed to view profiles.
 * - If the profile is for a coder, calculates the rank of the coder and adds it to the response.
 *   Rank = 1 + number of coders with a higher score.
 */
export const getUserProfileService = async (id, requester) => {
  // Check CoderModel first
  const coder = await CoderModel.findById(id).select("-password");
  if (coder) {
    const higherScoreCount = await CoderModel.countDocuments({
      score: { $gt: coder.score || 0 },
    });
    const rank = higherScoreCount + 1;

    const coderObj = coder.toObject();
    coderObj.rank = rank;
    return {
      type: "coder",
      profile: coderObj,
    };
  }

  // Check ManagerModel
  const manager = await ManagerModel.findById(id).select("-password");
  if (manager) {
    return {
      type: "manager",
      profile: manager.toObject(),
    };
  }

  return null;
};

/**
 * Service to update a user profile.
 * - Both managers and coders are allowed to update their profile.
 * - Enforces that users can only update their own profile.
 */
export const updateUserProfileService = async (id, updateData, requester) => {
  // Ensure the user is updating their own profile
  if (requester && requester.id !== id) {
    const error = new Error("Access forbidden: you can only update your own profile.");
    error.statusCode = 403;
    throw error;
  }

  const { about, firstName, lastName, avatar } = updateData;
  const updateFields = {};
  if (about !== undefined) updateFields.about = about;
  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;
  if (avatar !== undefined) updateFields.avatar = avatar;

  // Check and update coder
  const updatedCoder = await CoderModel.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true },
  ).select("-password");

  if (updatedCoder) {
    const higherScoreCount = await CoderModel.countDocuments({
      score: { $gt: updatedCoder.score || 0 },
    });
    const coderObj = updatedCoder.toObject();
    coderObj.rank = higherScoreCount + 1;
    return {
      type: "coder",
      profile: coderObj,
    };
  }

  // Check and update manager
  const updatedManager = await ManagerModel.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true },
  ).select("-password");

  if (updatedManager) {
    return {
      type: "manager",
      profile: updatedManager.toObject(),
    };
  }

  return null;
};
