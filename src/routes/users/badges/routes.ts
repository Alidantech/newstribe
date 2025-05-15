import { Router } from "express";
import * as badgesController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// All routes are protected
router.use(protectedRoute);

/**
 * @route POST /users/badges
 * @desc Award badge to user
 * @access Private
 */
router.post("/", badgesController.awardBadge);

/**
 * @route GET /users/badges
 * @desc Get user badges
 * @access Private
 */
router.get("/", badgesController.getUserBadges);

/**
 * @route GET /users/badges/count
 * @desc Get user badge count
 * @access Private
 */
router.get("/count", badgesController.getUserBadgeCount);

/**
 * @route GET /users/badges/:badgeId/check
 * @desc Check if user has a specific badge
 * @access Private
 */
router.get("/:badgeId/check", badgesController.checkUserBadge);

export default router; 