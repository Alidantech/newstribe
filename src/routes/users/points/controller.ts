import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as pointsService from "./service";

/**
 * Get user points history
 */
export const getUserPointsHistory = catchAsyncError(async (req: Request | any, res: Response) => {
  const points = await pointsService.getUserPointsHistoryService(req.user._id, req.query);
  ApiResponse.success(res, points, "Points history fetched successfully");
});

/**
 * Get total points for a user
 */
export const getUserTotalPoints = catchAsyncError(async (req: Request | any, res: Response) => {
  const totalPoints = await pointsService.getUserTotalPointsService(req.user._id);
  ApiResponse.success(res, { totalPoints }, "Total points fetched successfully");
});

/**
 * Get points by source
 */
export const getUserPointsBySource = catchAsyncError(async (req: Request | any, res: Response) => {
  const { source } = req.params;
  const points = await pointsService.getUserPointsBySourceService(req.user._id, source);
  ApiResponse.success(res, { points }, "Points by source fetched successfully");
});
