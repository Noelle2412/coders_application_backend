import Joi from "joi";
import { validate } from "./validate.js";

export const challengeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Title is required",
  }),
  category: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Category is required",
  }),
  description: Joi.string().trim().min(0).max(100000),
  level: Joi.string().valid("Easy", "Moderate", "Hard").required().messages({
    "any.only": "Level must be either 'Easy', 'Moderate', or 'Hard'",
  }),
  code: Joi.object({
    function_name: Joi.string().trim().min(1).max(100).required(),
    code_text: Joi.array()
      .length(2)
      .items(
        Joi.object({
          language: Joi.string().valid("py", "js").required(),
          text: Joi.string().trim().min(1).max(10000).required(),
        }),
      )
      .required(),
    inputs: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().trim().min(1).max(100).required(),
          type: Joi.string().trim().min(1).max(50).required(),
        }),
      )
      .required(),
  }).required(),
  tests: Joi.array()
    .items(
      Joi.object({
        inputs: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().trim().min(1).max(100).required(),
              value: Joi.any().required(),
            }),
          )
          .min(1)
          .required(),
        output: Joi.any().required(),
      }),
    )
    .min(1)
    .required(),
});

export const challengeSubmissionSchema = Joi.object({
  lang: Joi.string().valid("py", "js").required().messages({
    "any.only": "Language must be either 'py' or 'js'",
  }),
  code: Joi.string().trim().min(1).max(10000).required().messages({
    "string.empty": "Code is required",
  }),
  challenge_id: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Challenge ID is required",
  }),
});

export const validateChallenge = validate(challengeSchema);
export const validateChallengeSubmission = validate(challengeSubmissionSchema);
