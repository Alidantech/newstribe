import { UserReward } from "./model";
import { Reward } from "../../rewards/model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserReward } from "./type";
import { getUserTotalPointsService } from "../points/service";

/**
 * Redeem a reward
 */
export const redeemRewardService = async (
  userId: string,
  rewardId: string
): Promise<IUserReward> => {
  const reward = await Reward.findById(rewardId);
  if (!reward) {
    throw new ApiError(404, "Reward not found");
  }

  // Check if user has enough points
  const userPoints = await getUserTotalPointsService(userId);
  if (userPoints < reward.pointsRequired) {
    throw new ApiError(400, "Insufficient points to redeem this reward");
  }

  // Check if reward is still available
  if (!reward.isActive) {
    throw new ApiError(400, "This reward is no longer available");
  }

  // Check if user has already redeemed this reward
  const existingReward = await UserReward.findOne({ 
    user: userId, 
    reward: rewardId,
    status: { $in: ["pending", "redeemed"] }
  });
  if (existingReward) {
    throw new ApiError(400, "You have already redeemed this reward");
  }

  // Create reward redemption record
  const userReward = await UserReward.create({
    user: userId,
    reward: rewardId,
    status: "redeemed"
  });

  return userReward;
};

/**
 * Get user's redeemed rewards
 */
export const getUserRewardsService = async (userId: string, query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(
    UserReward.find({ user: userId }).populate("reward"),
    query
  )
    .filteration()
    .sort()
    .pagination();

  const rewards = await apiFeatures.getPaginatedData<IUserReward>("rewards");
  return rewards;
};

/**
 * Get user's reward statistics
 */
export const getUserRewardStatsService = async (userId: string): Promise<any> => {
  const stats = await UserReward.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    }
  ]);

  // Get available rewards
  const availableRewards = await Reward.find({ isActive: true });
  const userPoints = await getUserTotalPointsService(userId);

  return {
    stats,
    availableRewards: availableRewards.map(reward => ({
      ...reward.toObject(),
      canRedeem: userPoints >= reward.pointsRequired
    }))
  };
};

/**
 * Cancel a reward redemption
 */
export const cancelRewardRedemptionService = async (
  userId: string,
  rewardId: string
): Promise<IUserReward> => {
  const userReward = await UserReward.findOne({
    user: userId,
    reward: rewardId,
    status: "pending"
  });

  if (!userReward) {
    throw new ApiError(404, "No pending reward redemption found");
  }

  userReward.status = "cancelled";
  await userReward.save();

  return userReward;
}; 