import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as gamesService from "./service";
import { GameType } from "./type";

/**
 * Create a new game
 */
export const createGame = catchAsyncError(async (req: Request, res: Response) => {
  const game = await gamesService.createGameService(req.body);
  ApiResponse.success(res, { game }, "Game created successfully");
});

/**
 * Get all games
 */
export const getAllGames = catchAsyncError(async (req: Request, res: Response) => {
  const games = await gamesService.getAllGamesService(req.query);
  ApiResponse.success(res, games, "Games fetched successfully");
});

/**
 * Get game by ID
 */
export const getGameById = catchAsyncError(async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const game = await gamesService.getGameByIdService(gameId);
  ApiResponse.success(res, { game }, "Game fetched successfully");
});

/**
 * Update game
 */
export const updateGame = catchAsyncError(async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const game = await gamesService.updateGameService(gameId, req.body);
  ApiResponse.success(res, { game }, "Game updated successfully");
});

/**
 * Delete game
 */
export const deleteGame = catchAsyncError(async (req: Request, res: Response) => {
  const { gameId } = req.params;
  await gamesService.deleteGameService(gameId);
  ApiResponse.success(res, null, "Game deleted successfully");
});

/**
 * Get active games
 */
export const getActiveGames = catchAsyncError(async (req: Request, res: Response) => {
  const games = await gamesService.getActiveGamesService();
  ApiResponse.success(res, { games }, "Active games fetched successfully");
});

/**
 * Get games by type
 */
export const getGamesByType = catchAsyncError(async (req: Request, res: Response) => {
  const { type } = req.params;
  const games = await gamesService.getGamesByTypeService(type as GameType);
  ApiResponse.success(res, { games }, "Games fetched successfully");
});

/**
 * Update game status
 */
export const updateGameStatus = catchAsyncError(async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { status } = req.body;
  const game = await gamesService.updateGameStatusService(gameId, status);
  ApiResponse.success(res, { game }, "Game status updated successfully");
}); 