export const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const dataToValidate = req[property] || {};
    const { error, value } = schema.validate(dataToValidate, {
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

    req[property] = value;
    next();
  };
};

export default validate;
