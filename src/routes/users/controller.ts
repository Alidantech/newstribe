import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as userService from "./service";
import generateTokenAndSetCookies from "../../utils/login-token";

/**
 * Resend OTP by Email
 */
export const resendOtpByEmail = catchAsyncError(async (req: Request, res: Response) => {
  await userService.sendOtpByEmailService(req.body.email);
  ApiResponse.success(res, null, "OTP resent to email");
});

/**
 * Verify Email OTP
 */
export const verifyEmailOtp = catchAsyncError(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const customer = await userService.verifyEmailOtpService(email, otp);

  // Generate token and set cookies
  generateTokenAndSetCookies(customer._id as any, res);

  ApiResponse.success(res, { customer }, "Email verified successfully");
});

/**
 * Email OTP Login
 */
export const emailOtpLogin = catchAsyncError(async (req: Request, res: Response) => {
  const { email } = req.body;

  const customer = await userService.emailOtpLoginService(email);

  ApiResponse.success(res, { customer }, "OTP sent to email");
});

/**
 * Register new user
 */
export const registerUser = catchAsyncError(async (req: Request, res: Response) => {
  const { user } = await userService.registerUserService(req.body);

  // Generate token and set cookies
  generateTokenAndSetCookies(user._id as any, res);

  ApiResponse.success(res, { user }, "Registration successful");
});

/**
 * Login user
 */
export const loginUser = catchAsyncError(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userService.loginUserService(email, password);

  // Generate token and set cookies
  generateTokenAndSetCookies(user._id as any, res);

  ApiResponse.success(res, { user }, "Login successful");
});

/**
 * Get user profile
 */
export const getUserProfile = catchAsyncError(async (req: Request | any, res: Response) => {
  const user = await userService.getUserByIdService(req.user._id);
  ApiResponse.success(res, { user }, "User profile fetched successfully");
});

/**
 * Update user profile
 */
export const updateUserProfile = catchAsyncError(async (req: Request | any, res: Response) => {
  const user = await userService.updateUserService(req.user._id, req.body);
  ApiResponse.success(res, { user }, "Profile updated successfully");
});

// SUPER ADMIN AUTHENTICATION

/**
 * @desc SuperAdmin login with email and password
 * @route POST /users/super-admin-login
 * @access Public
 */
export const superAdminLogin = catchAsyncError(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await userService.superAdminLoginService(email, password);

  generateTokenAndSetCookies(user._id as any, res);

  ApiResponse.success(res, { user }, "SuperAdmin login successful");
});

/**
 * @desc SuperAdmin creates a new user with super admin privileges
 * @route POST /users/super-admin-create-user
 * @access Private (SuperAdmin only)
 */
export const superAdminCreateUser = catchAsyncError(async (req: Request, res: Response) => {
  const user = await userService.superAdminCreateUserService(req.body);
  ApiResponse.success(res, { user }, "SuperAdmin created user successfully");
});
