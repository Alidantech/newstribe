import { Router } from "express";
import * as preferencesController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// All routes are protected
router.use(protectedRoute);

/**
 * @route POST /users/preferences
 * @desc Create or update user preferences
 * @access Private
 */
router.post("/", preferencesController.createOrUpdatePreferences);

/**
 * @route GET /users/preferences
 * @desc Get user preferences
 * @access Private
 */
router.get("/", preferencesController.getUserPreferences);

/**
 * @route POST /users/preferences/generate
 * @desc Generate preferences using AI
 * @access Private
 */
router.post("/generate", preferencesController.generatePreferences);

/**
 * @route PATCH /users/preferences
 * @desc Update specific preference fields
 * @access Private
 */
router.patch("/", preferencesController.updatePreferenceFields);

/**
 * @route GET /users/preferences/category/:category
 * @desc Get preferences by category
 * @access Private
 */
router.get("/category/:category", preferencesController.getPreferencesByCategory);

/**
 * @route GET /users/preferences/level/:level
 * @desc Get preferences by reading level
 * @access Private
 */
router.get("/level/:level", preferencesController.getPreferencesByReadingLevel);

export default router; 