import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as gamesService from "./service";

/**
 * Record game play
 */
export const recordGamePlay = catchAsyncError(async (req: Request | any, res: Response) => {
  const { gameId, pointsEarned } = req.body;
  const userGame = await gamesService.recordGamePlayService(req.user._id, gameId, pointsEarned);
  ApiResponse.success(res, { userGame }, "Game play recorded successfully");
});

/**
 * Get user game history
 */
export const getUserGameHistory = catchAsyncError(async (req: Request | any, res: Response) => {
  const games = await gamesService.getUserGameHistoryService(req.user._id, req.query);
  ApiResponse.success(res, games, "Game history fetched successfully");
});

/**
 * Get user's total game points
 */
export const getUserGamePoints = catchAsyncError(async (req: Request | any, res: Response) => {
  const totalPoints = await gamesService.getUserGamePointsService(req.user._id);
  ApiResponse.success(res, { totalPoints }, "Total game points fetched successfully");
});

/**
 * Get user's game statistics
 */
export const getUserGameStats = catchAsyncError(async (req: Request | any, res: Response) => {
  const stats = await gamesService.getUserGameStatsService(req.user._id);
  ApiResponse.success(res, { stats }, "Game statistics fetched successfully");
});
