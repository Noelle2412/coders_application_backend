import { verifyToken } from "../utils/emailService.js";
import { CoderModel } from "../models/Coder.js";
import { ManagerModel } from "../models/Manager.js";

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
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role || null,
      };

      // If specific roles are required, verify role
      if (rolesArray.length > 0) {
        let userRole = decoded.role ? decoded.role.toLowerCase() : null;

        // If role was not encoded in token, resolve from database
        if (!userRole) {
          const isCoder = await CoderModel.findById(decoded.id);
          if (isCoder) {
            userRole = "coder";
          } else {
            const isManager = await ManagerModel.findById(decoded.id);
            if (isManager) userRole = "manager";
          }
          if (userRole) {
            req.user.role = userRole;
          }
        }

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

export default authorize;
