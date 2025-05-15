import { UserPoints } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserPoints, PointsSource } from "./type";

/**
 * Add points to user
 */
export const addUserPointsService = async (
  userId: string,
  points: number,
  source: PointsSource,
  description: string
): Promise<IUserPoints> => {
  const userPoints = await UserPoints.create({
    user: userId,
    pointsEarned: points,
    source,
    description,
  });
  return userPoints;
};

/**
 * Get user points history
 */
export const getUserPointsHistoryService = async (userId: string, query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(
    UserPoints.find({ user: userId }),
    query
  )
    .filteration()
    .sort()
    .pagination();

  const points = await apiFeatures.getPaginatedData<IUserPoints>("points");
  return points;
};

/**
 * Get total points for a user
 */
export const getUserTotalPointsService = async (userId: string): Promise<number> => {
  const result = await UserPoints.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$pointsEarned" } } }
  ]);
  return result[0]?.total || 0;
};

/**
 * Get points by source
 */
export const getUserPointsBySourceService = async (
  userId: string,
  source: PointsSource
): Promise<number> => {
  const result = await UserPoints.aggregate([
    { $match: { user: userId, source } },
    { $group: { _id: null, total: { $sum: "$pointsEarned" } } }
  ]);
  return result[0]?.total || 0;
}; 