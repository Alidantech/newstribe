import { Game } from "./model";
import { Content } from "../content/model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IGame, GameType } from "./type";

/**
 * Create a new game
 */
export const createGameService = async (gameData: Partial<IGame>): Promise<IGame> => {
  // Validate content exists
  const content = await Content.findById(gameData.content);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  // Validate dates
  if (new Date(gameData.startDate!) >= new Date(gameData.endDate!)) {
    throw new ApiError(400, "Start date must be before end date");
  }

  const game = await Game.create(gameData);
  return game;
};

/**
 * Get all games
 */
export const getAllGamesService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(
    Game.find().populate("content"),
    query
  )
    .filteration()
    .sort()
    .pagination();

  const games = await apiFeatures.getPaginatedData<IGame>("games");
  return games;
};

/**
 * Get game by ID
 */
export const getGameByIdService = async (gameId: string): Promise<IGame> => {
  const game = await Game.findById(gameId).populate("content");
  if (!game) {
    throw new ApiError(404, "Game not found");
  }
  return game;
};

/**
 * Update game
 */
export const updateGameService = async (
  gameId: string,
  updateData: Partial<IGame>
): Promise<IGame> => {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game not found");
  }

  // Validate dates if being updated
  if (updateData.startDate && updateData.endDate) {
    if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      throw new ApiError(400, "Start date must be before end date");
    }
  }

  Object.assign(game, updateData);
  await game.save();

  return game;
};

/**
 * Delete game
 */
export const deleteGameService = async (gameId: string): Promise<void> => {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game not found");
  }

  await game.deleteOne();
};

/**
 * Get active games
 */
export const getActiveGamesService = async (): Promise<IGame[]> => {
  const now = new Date();
  return Game.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate("content");
};

/**
 * Get games by type
 */
export const getGamesByTypeService = async (type: GameType): Promise<IGame[]> => {
  return Game.find({ type, status: "active" }).populate("content");
};

/**
 * Update game status
 */
export const updateGameStatusService = async (
  gameId: string,
  status: string
): Promise<IGame> => {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game not found");
  }

  game.status = status;
  await game.save();

  return game;
}; 