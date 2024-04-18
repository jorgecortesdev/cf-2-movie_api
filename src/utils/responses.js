const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  res.sendSuccessResponse = function (message, data = [], statusCode = 200) {
    this.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };

  res.sendErrorResponse = function (message, code) {
    this.status(code).json({
      success: false,
      error: {
        code,
        message,
      },
    });
  };

  next();
});

module.exports = router;
