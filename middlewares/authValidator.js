import Joi from "joi";
import { validate } from "./validate.js";

export const registrationSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("coder", "manager").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "First name cannot be empty",
    "string.min": "First name must be at least 2 characters long",
  }),
  lastName: Joi.string().trim().min(2).max(100).optional().messages({
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name must be at least 2 characters long",
  }),
  about: Joi.string().trim().max(1000).allow("").optional().messages({
    "string.max": "About section cannot exceed 1000 characters",
  }),
  avatar: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().trim().length(2),
      Joi.string().trim().valid(""),
    )
    .optional()
    .messages({
      "alternatives.match":
        "Avatar must be a valid URL, a 2-letter initials string, or empty",
    }),
}).min(1);

export const validateRegistration = validate(registrationSchema);
export const validateLogin = validate(loginSchema);
export const validateUpdateProfile = validate(updateProfileSchema);
