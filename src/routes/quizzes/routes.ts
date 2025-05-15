import { Router } from "express";
import * as quizzesController from "./controller";
import { protectedRoute } from "../../middleware/auth-user";

const router = Router();

// Public routes
router.get("/", quizzesController.getAllQuizzes);
router.get("/active", quizzesController.getActiveQuizzes);
router.get("/:quizId", quizzesController.getQuizById);
router.get("/generate/:contentId", quizzesController.generateQuizByContentId);

router.use(protectedRoute);

// Admin only routes
router.post("/", protectedRoute, quizzesController.createQuiz);
router.put("/:quizId", protectedRoute, quizzesController.updateQuiz);
router.delete("/:quizId", protectedRoute, quizzesController.deleteQuiz);
router.patch("/:quizId/status", protectedRoute, quizzesController.updateQuizStatus);

export default router; 