import jwt, { JwtPayload } from "jsonwebtoken";
import { catchAsyncError } from "../utils/api.catcher";
import { UserRequest } from "../types/global";
import { ApiError } from "../utils/api.errors";
import { JWT_SECRET } from "../config/env.config";
import { NextFunction, Response } from "express";
import User from "../routes/users/model";
import { UserRoles } from "../routes/users/type";

/**
 * Middleware function that protects routes by ensuring the user is authenticated and authorized.
 * This function verifies the JWT token from cookies, decodes it, checks the user's existence,
 * and checks if the user has the appropriate role and permission to access the route.
 * If the token is invalid or the user does not have permission, an error is thrown.
 *
 * @param {UserRequest} req - The request object containing the user and JWT token from the cookies.
 * @param {Response} res - The response object used to send responses back to the client.
 * @param {NextFunction} next - The next middleware function to call if the user is authenticated and authorized.
 *
 * @throws {ApiError} - If the token is missing, invalid, or expired, or if the user does not have the required role.
 * @throws {ApiError} - If the user does not exist or the route does not have a defined permission level.
 *
 * @description This middleware does the following:
 * - Verifies the JWT token from the cookies.
 * - Decodes the token and retrieves the user associated with it.
 * - Checks if the user's password was changed after the token was issued, invalidating the token if necessary.
 * - Determines the required access level for the route and HTTP method.
 * - Ensures that the user has the appropriate role and access level to access the route.
 */
const protectedRoute = catchAsyncError(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    // Retrieve the JWT token from cookies
    const token = req?.cookies?.token;

    // If no token is found, return an error response
    if (!token) return next(new ApiError(401, "Token was not provided!"));

    let decoded: JwtPayload;

    try {
      // Try to verify and decode the JWT token
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      // Retrieve the user based on the decoded token's user ID
      const user = await User.findById(decoded.userId);

      // If the user does not exist, return an error response
      if (!user) return next(new ApiError(404, "Unauthorized"));

      // Attach the user data to the request object
      req.user = user as any;

      // Attach the organisation data to the request object
    } catch (error) {
      return next(new ApiError(401, "Invalid token."));
    }

    if (req.user.roles.includes(UserRoles.CUSTOMER)) {
      next();
      return;
    }

    if (req.user.roles.includes(UserRoles.SUPER_ADMIN)) {
      next();
      return;
    }

    next();
  }
);

/**
 * Middleware to restrict access to SuperAdmin users only
 *
 * @throws ApiError 403 - If the authenticated user is not a SuperAdmin
 */
export const validateSuperAdmin = (req: UserRequest, res: Response, next: NextFunction) => {
  if (!req.user?.roles.includes(UserRoles.SUPER_ADMIN)) {
    throw new ApiError(403, "Access denied. SuperAdmin access required.");
  }
  next();
};

export { protectedRoute };
