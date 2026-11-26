import { CoderModel } from "../models/Coder.js";
import { ManagerModel } from "../models/Manager.js";
import { verifyToken } from "../utils/emailService.js";
import {
  renderVerificationSuccess,
  renderVerificationError,
} from "../views/verificationTemplates.js";

export const verifyUserAccount = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .send(renderVerificationError("Verification token is missing."));
  }

  try {
    const decoded = verifyToken(token);
    const { id, role } = decoded;

    if (!id || !role) {
      return res
        .status(400)
        .send(renderVerificationError("Invalid token payload."));
    }

    let user;
    if (role.toLowerCase() === "coder") {
      user = await CoderModel.findById(id);
    } else if (role.toLowerCase() === "manager") {
      user = await ManagerModel.findById(id);
    } else {
      return res
        .status(400)
        .send(renderVerificationError("Invalid user role specified in token."));
    }

    if (!user) {
      return res
        .status(404)
        .send(renderVerificationError("User account not found."));
    }

    if (user.is_verified) {
      return res
        .status(200)
        .send(renderVerificationSuccess(user, role));
    }

    user.is_verified = true;
    await user.save();

    return res.status(200).send(renderVerificationSuccess(user, role));
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .send(
          renderVerificationError(
            "Verification token has expired. Please request a new verification email.",
          ),
        );
    }

    return res
      .status(400)
      .send(
        renderVerificationError(
          "Invalid or corrupted verification token. Please check the link.",
        ),
      );
  }
};
