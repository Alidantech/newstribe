import { Router } from "express";
import * as commentsController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/:contentId", commentsController.getAllComments);
router.get("/:contentId/:commentId", commentsController.getCommentById);

// Protected routes
router.use(protectedRoute);
router.post("/:contentId", commentsController.createComment);
router.put("/:contentId/:commentId", commentsController.updateComment);
router.delete("/:contentId/:commentId", commentsController.deleteComment);

export default router; 