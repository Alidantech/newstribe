import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api.errors";
import { ApiResponse } from "../utils/api.response";

/**
 * Global error handler middleware to handle different types of errors.
 *
 * If the error is an instance of ApiError, it sends a response with
 * the status code, message, and optional details. If the error is not
 * an ApiError, it handles the error as a generic server error and
 * sends a 500 response with a generic error message.
 *
 * @param err - The error that occurred during the request handling.
 * @param _req - The Express Request object.
 * @param res - The Express Response object.
 * @param _next - The Express NextFunction (not used here).
 */
export const globalErrorHandler = (
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    // Handle ApiError specifically
    const response = new ApiResponse(err.statusCode, err.message, {
      errors: err.errors,
    });
    response.send(res);
  } else {
    // Handle uncaught errors
    const response = new ApiResponse(500, "Something went wrong");
    response.send(res);
  }
};
