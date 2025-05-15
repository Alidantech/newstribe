import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as progressService from "./service";

/**
 * Update user progress
 */
export const updateUserProgress = catchAsyncError(async (req: Request | any, res: Response) => {
  const { contentId, progress } = req.body;
  const userProgress = await progressService.updateUserProgressService(
    req.user._id,
    contentId,
    progress
  );
  ApiResponse.success(res, { userProgress }, "Progress updated successfully");
});

/**
 * Get user progress for specific content
 */
export const getUserProgress = catchAsyncError(async (req: Request | any, res: Response) => {
  const { contentId } = req.params;
  const userProgress = await progressService.getUserProgressService(req.user._id, contentId);
  ApiResponse.success(res, { userProgress }, "Progress fetched successfully");
});

/**
 * Get all progress for a user
 */
export const getAllUserProgress = catchAsyncError(async (req: Request | any, res: Response) => {
  const progress = await progressService.getAllUserProgressService(req.user._id, req.query);
  ApiResponse.success(res, progress, "Progress history fetched successfully");
});

/**
 * Update quiz score
 */
export const updateQuizScore = catchAsyncError(async (req: Request | any, res: Response) => {
  const { contentId } = req.params;
  const { score } = req.body;
  const userProgress = await progressService.updateQuizScoreService(
    req.user._id,
    contentId,
    score
  );
  ApiResponse.success(res, { userProgress }, "Quiz score updated successfully");
}); 