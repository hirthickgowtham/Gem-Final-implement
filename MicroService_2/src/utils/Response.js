
// utility function to send standardized responses
exports.sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
  error = null
) => {
  return res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
    error
  });
};
