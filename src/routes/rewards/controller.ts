import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as rewardsService from "./service";
import { RewardType } from "./type";

/**
 * Create a new reward
 */
export const createReward = catchAsyncError(async (req: Request, res: Response) => {
  const reward = await rewardsService.createRewardService(req.body);
  ApiResponse.success(res, { reward }, "Reward created successfully");
});

/**
 * Get all rewards
 */
export const getAllRewards = catchAsyncError(async (req: Request, res: Response) => {
  const rewards = await rewardsService.getAllRewardsService(req.query);
  ApiResponse.success(res, rewards, "Rewards fetched successfully");
});

/**
 * Get reward by ID
 */
export const getRewardById = catchAsyncError(async (req: Request, res: Response) => {
  const { rewardId } = req.params;
  const reward = await rewardsService.getRewardByIdService(rewardId);
  ApiResponse.success(res, { reward }, "Reward fetched successfully");
});

/**
 * Update reward
 */
export const updateReward = catchAsyncError(async (req: Request, res: Response) => {
  const { rewardId } = req.params;
  const reward = await rewardsService.updateRewardService(rewardId, req.body);
  ApiResponse.success(res, { reward }, "Reward updated successfully");
});

/**
 * Delete reward
 */
export const deleteReward = catchAsyncError(async (req: Request, res: Response) => {
  const { rewardId } = req.params;
  await rewardsService.deleteRewardService(rewardId);
  ApiResponse.success(res, null, "Reward deleted successfully");
});

/**
 * Get rewards by type
 */
export const getRewardsByType = catchAsyncError(async (req: Request, res: Response) => {
  const { type } = req.params;
  const rewards = await rewardsService.getRewardsByTypeService(type as RewardType);
  ApiResponse.success(res, { rewards }, "Rewards fetched successfully");
});

/**
 * Get active rewards
 */
export const getActiveRewards = catchAsyncError(async (req: Request, res: Response) => {
  const rewards = await rewardsService.getActiveRewardsService();
  ApiResponse.success(res, { rewards }, "Active rewards fetched successfully");
}); 