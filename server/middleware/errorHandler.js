const { StatusCodes } = require("http-status-codes");
const { CustomErrorAPI } = require("../errors");

/***** GLOBAL ERROR HANDLER */
module.exports = globalErrorHandler = (err, req, res, next) => {
  if (err instanceof CustomErrorAPI) {
    return res.status(err.statusCode).json({
      success: false,
      msg: err.message,
    });
  }

  /**** KNOWN ANOMALIES */
  let customError = { ...err };

  if (err.code && err.code === 11000) {
    customError = handleDBDuplicateValueError(customError);
  }
  if (err.name === "CastError") {
    customError = handleDBCastError(customError);
  }

  if (err.name === "ValidationError") {
    customError = handleDBValidationError(customError);
  }

  if (err.name === "JsonWebTokenError") {
    customError = handleJsonWebTokenError(customError);
  }

  if (err.name === "TokenExpiredError") {
    customError = handleTokenExpiredError(customError);
  }

  /*** anomalies return point */

  if (customError.isOperational) {
    return res.status(customError.statusCode).json({
      success: false,
      msg: customError.message,
    });
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      msg: "Something went wrong. Please try again!",
      error: err,
      stack: err.stack,
    });
  }
};

/***** ANOMALIES HANDLERS */

// Duplicate errors thrown by database
const handleDBDuplicateValueError = (error) => {
  const keyValues = Object.entries(error.keyValue);
  const message = `Duplicate values detected! [${
    keyValues[0][0] + ": " + keyValues[0][1]
  }] already exists! Please enter another value.`;

  const customError = new CustomErrorAPI(message, StatusCodes.BAD_REQUEST);

  return customError;
};

// Invalid mongoDB object ids
const handleDBCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  const customError = new CustomErrorAPI(message, StatusCodes.BAD_REQUEST);

  return customError;
};

// Problem validating database inputs
const handleDBValidationError = (error) => {
  const message = Object.values(error.errors)
    .map((err) => `[${err.message}]`)
    .join(" =>!~~~~! => ");

  const customError = new CustomErrorAPI(
    `${error._message} => ${message}`,
    StatusCodes.BAD_REQUEST
  );

  return customError;
};

// Problem verifying tokens
const handleJsonWebTokenError = (error) =>
  new CustomErrorAPI(`${error.name}: Please login`, StatusCodes.FORBIDDEN);

// Token has expired
const handleTokenExpiredError = (error) =>
  new CustomErrorAPI(`${error.name}: Please login`, StatusCodes.UNAUTHORIZED);
