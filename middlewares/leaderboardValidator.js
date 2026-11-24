import Joi from "joi";
import { validate } from "./validate.js";

export const topCodersQuerySchema = Joi.object({
  K: Joi.number().integer().min(1).max(100).default(3).messages({
    "number.base": "K must be a number",
    "number.integer": "K must be an integer",
    "number.min": "K must be between 1 and 100",
    "number.max": "K must be between 1 and 100",
  }),
});

export const validateTopCodersQuery = validate(topCodersQuerySchema, "query");
