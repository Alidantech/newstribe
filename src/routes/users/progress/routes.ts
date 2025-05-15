import { Router } from "express";
import * as progressController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// All routes are protected
router.use(protectedRoute);

/**
 * @route POST /users/progress
 * @desc Update user progress
 * @access Private
 */
router.post("/", progressController.updateUserProgress);

/**
 * @route GET /users/progress/:contentId
 * @desc Get user progress for specific content
 * @access Private
 */
router.get("/:contentId", progressController.getUserProgress);

/**
 * @route GET /users/progress
 * @desc Get all progress for a user
 * @access Private
 */
router.get("/", progressController.getAllUserProgress);

/**
 * @route PUT /users/progress/:contentId/quiz
 * @desc Update quiz score
 * @access Private
 */
router.put("/:contentId/quiz", progressController.updateQuizScore);

export default router; 