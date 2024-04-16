const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
  res.sendSuccessResponse = function (message, data = [], statusCode = 200) {
    this.status(statusCode).json({
      success: true,
      message: message,
      data: data
    });
  }

  res.sendErrorResponse = function (message, code) {
    this.status(code).json({
      success: false,
      error: {
        code: code,
        message: message
      }
    });
  }

  next();
});

module.exports = router;
