import { Router } from "express";
import * as contentController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

//! PUBLIC ROUTES

/**
 * @route GET /content
 * @desc Get all content with filters
 * @access Public
 */
router.get("/", contentController.getAllContent);

/**
 * @route GET /content/:id
 * @desc Get content by ID
 * @access Public
 */
router.get("/:id", contentController.getContentById);

//! PROTECTED ROUTES
router.use(protectedRoute);

/**
 * @route POST /content
 * @desc Create new content
 * @access Private
 */
router.post("/", contentController.createContent);

/**
 * @route PUT /content/:id
 * @desc Update content
 * @access Private
 */
router.put("/:id", contentController.updateContent);

/**
 * @route DELETE /content/:id
 * @desc Delete content
 * @access Private
 */
router.delete("/:id", contentController.deleteContent);

export default router;
