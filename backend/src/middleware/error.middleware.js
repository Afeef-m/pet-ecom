const errorMiddleware = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Duplicate key (Mongo)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorMiddleware;