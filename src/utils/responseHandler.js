module.exports = {
  success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },

  error(res, message = 'Error', statusCode = 500, details) {
    return res.status(statusCode).json({
      success: false,
      message,
      details,
    });
  },
};

