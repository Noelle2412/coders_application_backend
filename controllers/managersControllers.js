import bcrypt from "bcrypt";
import { ManagerModel } from "../models/Manager.js";

export const managersRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingManager = await ManagerModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingManager) {
      return res.status(409).json({
        status: "fail",
        message: "Manager with this email already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newManager = await ManagerModel.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const managerData = newManager.toObject();
    delete managerData.password;

    return res.status(201).json({
      status: "success",
      message: "Manager registered successfully",
      data: managerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during manager registration",
      error: error.message,
    });
  }
};

export const managersLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const manager = await ManagerModel.findOne({
      email: email.toLowerCase(),
    });

    if (!manager) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const managerData = manager.toObject();
    delete managerData.password;

    return res.status(200).json({
      status: "success",
      message: "Manager logged in successfully",
      data: managerData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred during manager login",
      error: error.message,
    });
  }
};

export const getManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const manager = await ManagerModel.findById(id).select("-password");
    if (!manager) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: manager,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the manager",
      error: error.message,
    });
  }
};

export const updateManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const { about, firstName, lastName } = req.body;

    const updateFields = {};
    if (about !== undefined) updateFields.description = about;
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;

    const updatedManager = await ManagerModel.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedManager) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Manager updated successfully",
      data: updatedManager,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while updating the manager",
      error: error.message,
    });
  }
};

export const deleteManagerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedManager = await ManagerModel.findByIdAndDelete(id);
    if (!deletedManager) {
      return res.status(404).json({
        status: "fail",
        message: "Manager not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Manager deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the manager",
      error: error.message,
    });
  }
};
