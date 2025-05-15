import { Router } from "express";
import * as gamesController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// All routes are protected
router.use(protectedRoute);

/**
 * @route POST /users/games
 * @desc Record game play
 * @access Private
 */
router.post("/", gamesController.recordGamePlay);

/**
 * @route GET /users/games
 * @desc Get user game history
 * @access Private
 */
router.get("/", gamesController.getUserGameHistory);

/**
 * @route GET /users/games/points
 * @desc Get user's total game points
 * @access Private
 */
router.get("/points", gamesController.getUserGamePoints);

/**
 * @route GET /users/games/stats
 * @desc Get user's game statistics
 * @access Private
 */
router.get("/stats", gamesController.getUserGameStats);

export default router; 