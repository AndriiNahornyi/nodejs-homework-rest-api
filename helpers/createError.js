const createError = (status, message) => {
  console.log(message, status);
  const error = new Error(message);
  error.status = status;
  return error;
};

module.exports = createError;
