import Joi from "joi";

export const challengeSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Title is required",
  }),
  category: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Category is required",
  }),
  description: Joi.string().trim().min(0).max(1000),
  level: Joi.string().valid("Easy", "Moderate", "Hard").required().messages({
    "any.only": "Level must be either 'Easy', 'Moderate', or 'Hard'",
  }),
  code: {
    function_name: Joi.string().trim().min(1).max(100).required(),
    code_text: Joi.array()
      .items(Joi.string().trim().min(1).max(10000))
      .required(),
    inputs: Joi.array().items(Joi.string().trim().min(0).max(1000)).required(),
  },
  tests: Joi.array(),
});

export const validateChallenge = (req, res, next) => {
  const { error, value } = challengeSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  req.body = value;
  next();
};

export const challengeSubmissionSchema = Joi.object({
  lang: Joi.string().valid("py", "js").required().messages({
    "any.only": "Language must be either 'py' or 'js'",
  }),
  code: Joi.string().trim().min(1).max(10000).required().messages({
    "string.empty": "Code is required",
  }),
  challengeId: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Challenge ID is required",
  }),
});

export const validateChallengeSubmission = (req, res, next) => {
  const { error, value } = challengeSubmissionSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({
      status: "fail",
      message: "Validation failed",
      errors: errorMessages,
    });
  }
  req.body = value;
  next();
};
