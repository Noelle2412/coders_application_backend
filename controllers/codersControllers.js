import bcrypt from "bcrypt";
import { CoderModel } from "../models/Coder.js";

export const codersRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingCoder = await CoderModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingCoder) {
      return res.status(409).json({
        status: "fail",
        message: "Coder with this email already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newCoder = await CoderModel.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const coderData = newCoder.toObject();
    delete coderData.password;

    return res.status(201).json({
      status: "success",
      message: "Coder registered successfully",
      data: coderData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during coder registration",
      error: error.message,
    });
  }
};

export const codersLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const coder = await CoderModel.findOne({
      email: email.toLowerCase(),
    });

    if (!coder) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, coder.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const coderData = coder.toObject();
    delete coderData.password;

    return res.status(200).json({
      status: "success",
      message: "Coder logged in successfully",
      data: coderData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during coder login",
      error: error.message,
    });
  }
};

export const getCoderById = async (req, res) => {
  try {
    const { id } = req.params;
    const coder = await CoderModel.findById(id).select("-password");
    if (!coder) {
      return res.status(404).json({
        status: "fail",
        message: "Coder not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: coder,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the coder",
      error: error.message,
    });
  }
};

export const updateCoderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { about, firstName, lastName, avatar } = req.body;

    const updateFields = {};
    if (about !== undefined) updateFields.about = about;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const updatedCoder = await CoderModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedCoder) {
      return res.status(404).json({
        status: "fail",
        message: "Coder not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Coder updated successfully",
      data: updatedCoder,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the coder",
      error: error.message,
    });
  }
};

export const deleteCoderById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoder = await CoderModel.findByIdAndDelete(id);
    if (!deletedCoder) {
      return res.status(404).json({
        status: "fail",
        message: "Coder not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Coder deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the coder",
      error: error.message,
    });
  }
};
