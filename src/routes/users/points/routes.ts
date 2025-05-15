import { Router } from "express";
import * as pointsController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// All routes are protected
router.use(protectedRoute);

/**
 * @route GET /users/points
 * @desc Get user points history
 * @access Private
 */
router.get("/", pointsController.getUserPointsHistory);

/**
 * @route GET /users/points/total
 * @desc Get total points for a user
 * @access Private
 */
router.get("/total", pointsController.getUserTotalPoints);

/**
 * @route GET /users/points/source/:source
 * @desc Get points by source
 * @access Private
 */
router.get("/source/:source", pointsController.getUserPointsBySource);

export default router; 