import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as rewardsService from "./service";

/**
 * Redeem a reward
 */
export const redeemReward = catchAsyncError(async (req: Request | any, res: Response) => {
  const { rewardId } = req.body;
  const userReward = await rewardsService.redeemRewardService(req.user._id, rewardId);
  ApiResponse.success(res, { userReward }, "Reward redeemed successfully");
});

/**
 * Get user's redeemed rewards
 */
export const getUserRewards = catchAsyncError(async (req: Request | any, res: Response) => {
  const rewards = await rewardsService.getUserRewardsService(req.user._id, req.query);
  ApiResponse.success(res, rewards, "Rewards fetched successfully");
});

/**
 * Get user's reward statistics
 */
export const getUserRewardStats = catchAsyncError(async (req: Request | any, res: Response) => {
  const stats = await rewardsService.getUserRewardStatsService(req.user._id);
  ApiResponse.success(res, stats, "Reward statistics fetched successfully");
});

/**
 * Cancel a reward redemption
 */
export const cancelRewardRedemption = catchAsyncError(async (req: Request | any, res: Response) => {
  const { rewardId } = req.params;
  const userReward = await rewardsService.cancelRewardRedemptionService(req.user._id, rewardId);
  ApiResponse.success(res, { userReward }, "Reward redemption cancelled successfully");
}); 