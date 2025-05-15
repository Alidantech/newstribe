import { Router } from "express";
import * as userController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";
import redeemRoutes from "./redeem/routes";
import gamesRoutes from "./games/routes";
import badgesRoutes from "./badges/routes";
import progressRoutes from "./progress/routes";
import rewardsRoutes from "./rewards/routes";
import pointsRoutes from "./points/routes";

const router = Router();

//! PUBLIC ROUTES
/**
 * @route POST /users/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", userController.registerUser);

/**
 * @route POST /users/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", userController.loginUser);

/**
 * @route POST /users/email-otp-login
 * @desc Email OTP Login
 * @access Public
 */
router.post("/email-otp-login", userController.emailOtpLogin);

/**
 * @route POST /users/resend-otp-email
 * @desc Resend OTP by Email
 * @access Public
 */
router.post("/resend-otp-email", userController.resendOtpByEmail);

/**
 * @route POST /users/verify-email-otp
 * @desc Verify Email OTP
 * @access Public
 */
router.post("/verify-email-otp", userController.verifyEmailOtp);

/**
 * @route POST /users/super-admin-login
 * @desc SuperAdmin login
 * @access Public
 */
router.post("/super-admin-login", userController.superAdminLogin);

/**
 * @route POST /users/super-admin-create-user
 * @desc SuperAdmin create user
 * @access Public
 */
router.post("/super-admin-create-user", userController.superAdminCreateUser);
    
//! PROTECTED ROUTES
router.use(protectedRoute);

/**
 * @route Get /users
 * @role Admin
 */

/**
 * @route GET /users/profile/me
 * @desc Get user profile
 * @access Private
 */
router.get("/profile/me", userController.getUserProfile);

/**
 * @route PUT /users/profile/me
 * @desc Update user profile
 * @access Private
 */
router.put("/profile/me", userController.updateUserProfile);

//! NESTED ROUTES
router.use("/redeem", redeemRoutes);
router.use("/games", gamesRoutes);
router.use("/badges", badgesRoutes);
router.use("/progress", progressRoutes);
router.use("/rewards", rewardsRoutes);
router.use("/points", pointsRoutes);

export default router;