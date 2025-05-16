import { UserPoints } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserPoints, PointsSource } from "./type";
import User from "../../users/model";
import { Types } from "mongoose";

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
export const getUserPointsHistoryService = async (
  userId: string,
  query: any = {}
): Promise<any> => {
  const apiFeatures = new ApiFeatures(UserPoints.find({ user: userId }), query)
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
    { $group: { _id: null, total: { $sum: "$pointsEarned" } } },
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
    { $group: { _id: null, total: { $sum: "$pointsEarned" } } },
  ]);
  return result[0]?.total || 0;
};

/**
 * Update user points by id
 */
export const updateUserPointsByIdService = async (
  userId: string,
  pointsId: Types.ObjectId
): Promise<void> => {
  // Get the points record
  const pointsRecord = await UserPoints.findById(pointsId);
  if (!pointsRecord) {
    throw new ApiError(404, "Points record not found");
  }

  // Get current user points
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Increment user points
  user.points = (user.points || 0) + pointsRecord.pointsEarned;
  await user.save();
};

/**
 * Award points to a user
 */
export const awardPointsService = async (
  userId: string,
  points: number,
  source: PointsSource,
  description: string
): Promise<IUserPoints> => {
  // Create points record
  const userPoints = await UserPoints.create({
    user: userId,
    pointsEarned: points,
    source,
    description,
  });

  // Update user's total points
  await updateUserPointsByIdService(userId, userPoints._id);

  return userPoints;
};
