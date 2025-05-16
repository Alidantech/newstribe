import { Router } from "express";
import * as contentController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";
import contentTagRouter from "./tags/routes";
import contentCommentRouter from "./comments/routes";
import contentLikeRouter from "./likes/routes";
import contentShareRouter from "./shares/routes";
import contentViewRouter from "./views/routes";

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
 * @route POST /content/generate
 * @desc Generate content
 * @access Private
 */
router.post("/generate", contentController.generateContent);

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

//! CONTENT TAGS ROUTES
router.use("/tags", contentTagRouter);

//! CONTENT COMMENTS ROUTES
router.use("/comments", contentCommentRouter);

//! CONTENT LIKES ROUTES
router.use("/likes", contentLikeRouter);

//! CONTENT SHARES ROUTES
router.use("/shares", contentShareRouter);

//! CONTENT VIEWS ROUTES
router.use("/views", contentViewRouter);

export default router;
