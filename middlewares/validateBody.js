const { createError } = require("../helpers");

const vaidateBody = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.message));
    }
    next();
  };
  return func;
};

module.exports = vaidateBody;
