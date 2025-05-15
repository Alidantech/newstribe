import { UserGame } from "./model";
import { Game } from "../../games/model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserGame } from "./type";
import { addUserPointsService } from "../points/service";
import { PointsSource } from "../points/type";

/**
 * Record game play and award points
 */
export const recordGamePlayService = async (
  userId: string,
  gameId: string,
  pointsEarned: number
): Promise<IUserGame> => {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new ApiError(404, "Game not found");
  }

  // Create game play record
  const userGame = await UserGame.create({
    user: userId,
    game: gameId,
    pointsEarned
  });

  // Award points for playing the game
  await addUserPointsService(
    userId,
    pointsEarned,
    PointsSource.GAME_PLAY,
    `Played ${game.name}`
  );

  return userGame;
};

/**
 * Get user game history
 */
export const getUserGameHistoryService = async (userId: string, query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(
    UserGame.find({ user: userId }).populate("game"),
    query
  )
    .filteration()
    .sort()
    .pagination();

  const games = await apiFeatures.getPaginatedData<IUserGame>("games");
  return games;
};

/**
 * Get user's total game points
 */
export const getUserGamePointsService = async (userId: string): Promise<number> => {
  const result = await UserGame.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$pointsEarned" } } }
  ]);
  return result[0]?.total || 0;
};

/**
 * Get user's game statistics
 */
export const getUserGameStatsService = async (userId: string): Promise<any> => {
  const stats = await UserGame.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$game",
        totalPlays: { $sum: 1 },
        totalPoints: { $sum: "$pointsEarned" },
        lastPlayed: { $max: "$playedAt" }
      }
    },
    {
      $lookup: {
        from: "games",
        localField: "_id",
        foreignField: "_id",
        as: "gameDetails"
      }
    },
    { $unwind: "$gameDetails" }
  ]);
  return stats;
}; 