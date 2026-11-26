import { verifyToken } from "../utils/emailService.js";
import { CoderModel } from "../models/Coder.js";
import { ManagerModel } from "../models/Manager.js";
import mongoose from "mongoose";

/**
 * Middleware validating that req.params.id is a valid MongoDB ObjectId.
 */
export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ID format for parameter '${paramName}'.`,
      });
    }
    next();
  };
};

/**
 * Creates an authentication and authorization middleware.
 * @param {Array<string>|string} [allowedRoles=[]] - Roles allowed to access the route (e.g. ['Coder', 'Manager'], 'Manager').
 * If empty or omitted, any authenticated user with a valid token is allowed.
 */
export const authorize = (allowedRoles = []) => {
  const rolesArray = Array.isArray(allowedRoles)
    ? allowedRoles.map((r) => r.toLowerCase())
    : [allowedRoles.toLowerCase()];

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          status: "fail",
          message: "Authentication token is missing or malformed.",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyToken(token);

      if (!decoded || !decoded.id || !decoded.email) {
        return res.status(401).json({
          status: "fail",
          message: "Invalid token payload.",
        });
      }

      // Inject user info into request object
      let userRole = decoded.role ? decoded.role.toLowerCase() : null;

      if (!userRole) {
        const isCoder = await CoderModel.findById(decoded.id);
        if (isCoder) {
          userRole = "coder";
        } else {
          const isManager = await ManagerModel.findById(decoded.id);
          if (isManager) userRole = "manager";
        }
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: userRole,
      };

      // If specific roles are required, verify role
      if (rolesArray.length > 0) {
        if (!userRole || !rolesArray.includes(userRole)) {
          return res.status(403).json({
            status: "fail",
            message: "Access forbidden: insufficient permissions.",
          });
        }
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "fail",
          message: "Token has expired. Please log in again.",
        });
      }

      return res.status(401).json({
        status: "fail",
        message: "Invalid authentication token.",
      });
    }
  };
};

/**
 * Middleware ensuring a user can only perform an operation on their own account.
 * Compares req.user.id with req.params.id.
 */
export const ensureSelf = (req, res, next) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({
      status: "fail",
      message: "Authentication required.",
    });
  }

  if (req.user.id !== req.params.id) {
    return res.status(403).json({
      status: "fail",
      message: "Access forbidden: you can only manage your own account.",
    });
  }

  next();
};

export default authorize;
