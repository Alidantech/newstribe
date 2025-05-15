import { Router } from "express";
import * as commentsController from "./controller";
import { protectedRoute } from "../../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", commentsController.getAllComments);
router.get("/content/:contentId", commentsController.getCommentsByContent);
router.get("/user/:userId", commentsController.getCommentsByUser);
router.get("/:commentId", commentsController.getCommentById);

// Protected routes
router.use(protectedRoute);
router.post("/", commentsController.createComment);
router.put("/:commentId", commentsController.updateComment);
router.delete("/:commentId", commentsController.deleteComment);

export default router; 