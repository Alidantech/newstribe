import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as quizzesService from "./service";
import { QuizDifficulty } from "./type";

/**
 * Create a new quiz
 */
export const createQuiz = catchAsyncError(async (req: Request, res: Response) => {
  const quiz = await quizzesService.createQuizService(req.body);
  ApiResponse.success(res, { quiz }, "Quiz created successfully");
});

/**
 * Generate quiz with AI by content ID
 */
export const generateQuizByContentId = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const { difficulty } = req.query;
  const quiz = await quizzesService.generateQuizByContentIdService(contentId, difficulty as QuizDifficulty);
  ApiResponse.success(res, { quiz }, "Quiz generated successfully");
});

/**
 * Get all quizzes
 */
export const getAllQuizzes = catchAsyncError(async (req: Request, res: Response) => {
  const quizzes = await quizzesService.getAllQuizzesService(req.query);
  ApiResponse.success(res, quizzes, "Quizzes fetched successfully");
});

/**
 * Get quiz by ID
 */
export const getQuizById = catchAsyncError(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const quiz = await quizzesService.getQuizByIdService(quizId);
  ApiResponse.success(res, { quiz }, "Quiz fetched successfully");
});

/**
 * Update quiz
 */
export const updateQuiz = catchAsyncError(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const quiz = await quizzesService.updateQuizService(quizId, req.body);
  ApiResponse.success(res, { quiz }, "Quiz updated successfully");
});

/**
 * Delete quiz
 */
export const deleteQuiz = catchAsyncError(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  await quizzesService.deleteQuizService(quizId);
  ApiResponse.success(res, null, "Quiz deleted successfully");
});

/**
 * Get active quizzes
 */
export const getActiveQuizzes = catchAsyncError(async (req: Request, res: Response) => {
  const quizzes = await quizzesService.getActiveQuizzesService();
  ApiResponse.success(res, { quizzes }, "Active quizzes fetched successfully");
});

/**
 * Update quiz status
 */
export const updateQuizStatus = catchAsyncError(async (req: Request, res: Response) => {
  const { quizId } = req.params;
  const { status } = req.body;
  const quiz = await quizzesService.updateQuizStatusService(quizId, status);
  ApiResponse.success(res, { quiz }, "Quiz status updated successfully");
}); 