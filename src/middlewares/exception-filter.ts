// import { ErrorCode } from "@/constants/error-code";
// import { ErrorMessages } from "@/constants/message";
// import { HttpStatusCode } from "@/constants/status-code";
// import { AppError } from "@/common/error.response";
// import { NextFunction, Request, Response } from "express";
// import { logger } from "@/utils/logger";

// // Global error-handling middleware for Express
// export const exceptionHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // Handle different types of errors
//   let status: number = HttpStatusCode.INTERNAL_SERVER_ERROR;
//   let errorCode: string = ErrorCode.INTERNAL_SERVER_ERROR;
//   let message: string = ErrorMessages.SERVER_ERROR;
//   let details: any = {};

//   if (err instanceof AppError) {
//     // Custom application errors
//     status = err.statusCode;
//     errorCode = err.errorCode;
//     message = err.message;
//     details = err.details || {};
//   } else if (err.name === 'ValidationError') {
//     // Joi validation errors
//     status = HttpStatusCode.BAD_REQUEST;
//     errorCode = ErrorCode.VALIDATION_ERROR;
//     message = ErrorMessages.VALIDATION_FAILED;
//     details = err.details;
//   } else if (err.code === 'ER_DUP_ENTRY') {
//     // MySQL duplicate entry error
//     status = HttpStatusCode.CONFLICT;
//     errorCode = ErrorCode.EMAIL_ALREADY_EXISTS;
//     message = ErrorMessages.EMAIL_ALREADY_EXISTS;
//   } else if (err.name === 'JsonWebTokenError') {
//     // JWT errors
//     status = HttpStatusCode.UNAUTHORIZED;
//     errorCode = ErrorCode.INVALID_TOKEN;
//     message = ErrorMessages.UNAUTHORIZED;
//   } else if (err.name === 'TokenExpiredError') {
//     // JWT expired
//     status = HttpStatusCode.UNAUTHORIZED;
//     errorCode = ErrorCode.EXPIRED_TOKEN;
//     message = ErrorMessages.UNAUTHORIZED;
//   }

//   // Log error for debugging
//   logger.error(`${req.method} ${req.originalUrl} - ${message} - ${err.stack || err.message}`);

//   res.status(status).json({
//     success: false,
//     message,
//     statusCode: status,
//     errorCode,
//     details,
//     timestamp: new Date().toISOString(),
//     path: req.originalUrl,
//   });
// };

import { ErrorCode } from "@/constants/error-code";
import { ErrorMessages } from "@/constants/message";
import { HttpStatusCode } from "@/constants/status-code";
import { AppError } from "@/common/error.response";
import { NextFunction, Request, Response } from "express";
import { logger } from "@/utils/logger";

// Global error-handling middleware for Express
export const exceptionHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
  const errorCode = err.errorCode! || ErrorCode.INTERNAL_SERVER_ERROR;

  // console.log("check err::", err);
  logger.error(err.message);

  res.status(status).json({
    success: false,
    message: err.message || ErrorMessages.SERVER_ERROR,
    statusCode: status,
    errorCode: errorCode,
    details: err.details || {},
  });
};