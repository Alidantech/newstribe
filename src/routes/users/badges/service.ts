import { UserBadge } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserBadge } from "./type";
import { addUserPointsService } from "../points/service";
import { PointsSource } from "../points/type";
import { Badge } from "../badges/model";

/**
 * Award badge to user
 */
export const awardBadgeToUserService = async (
  userId: string,
  badgeId: string
): Promise<IUserBadge> => {
  const badge = await Badge.findById(badgeId);
  if (!badge) {
    throw new ApiError(404, "Badge not found");
  }

  // Check if user already has this badge
  const existingBadge = await UserBadge.findOne({ user: userId, badge: badgeId });
  if (existingBadge) {
    throw new ApiError(400, "User already has this badge");
  }

  // Create user badge
  const userBadge = await UserBadge.create({
    user: userId,
    badge: badgeId,
  });

  // Award points for earning the badge
  if (badge.points) {
    await addUserPointsService(
      userId,
      badge.points,
      PointsSource.BADGE_EARN,
      `Earned ${badge.name} badge`
    );
  }

  return userBadge;
};

/**
 * Get user badges
 */
export const getUserBadgesService = async (userId: string, query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(UserBadge.find({ user: userId }).populate("badge"), query)
    .filteration()
    .sort()
    .pagination();

  const badges = await apiFeatures.getPaginatedData<IUserBadge>("badges");
  return badges;
};

/**
 * Check if user has a specific badge
 */
export const checkUserBadgeService = async (userId: string, badgeId: string): Promise<boolean> => {
  const userBadge = await UserBadge.findOne({ user: userId, badge: badgeId });
  return !!userBadge;
};

/**
 * Get user badge count
 */
export const getUserBadgeCountService = async (userId: string): Promise<number> => {
  return UserBadge.countDocuments({ user: userId });
};
