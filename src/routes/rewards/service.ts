import { Reward } from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IReward, RewardType } from "./type";

/**
 * Create a new reward
 */
export const createRewardService = async (rewardData: Partial<IReward>): Promise<IReward> => {
  // Check if reward with same name exists
  const existingReward = await Reward.findOne({ name: rewardData.name });
  if (existingReward) {
    throw new ApiError(400, "Reward with this name already exists");
  }

  const reward = await Reward.create(rewardData);
  return reward;
};

/**
 * Get all rewards
 */
export const getAllRewardsService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Reward.find(), query)
    .filteration()
    .sort()
    .pagination();

  const rewards = await apiFeatures.getPaginatedData<IReward>("rewards");
  return rewards;
};

/**
 * Get reward by ID
 */
export const getRewardByIdService = async (rewardId: string): Promise<IReward> => {
  const reward = await Reward.findById(rewardId);
  if (!reward) {
    throw new ApiError(404, "Reward not found");
  }
  return reward;
};

/**
 * Update reward
 */
export const updateRewardService = async (
  rewardId: string,
  updateData: Partial<IReward>
): Promise<IReward> => {
  const reward = await Reward.findById(rewardId);
  if (!reward) {
    throw new ApiError(404, "Reward not found");
  }

  // Check name uniqueness if name is being updated
  if (updateData.name && updateData.name !== reward.name) {
    const existingReward = await Reward.findOne({ name: updateData.name });
    if (existingReward) {
      throw new ApiError(400, "Reward with this name already exists");
    }
  }

  Object.assign(reward, updateData);
  await reward.save();

  return reward;
};

/**
 * Delete reward
 */
export const deleteRewardService = async (rewardId: string): Promise<void> => {
  const reward = await Reward.findById(rewardId);
  if (!reward) {
    throw new ApiError(404, "Reward not found");
  }

  await reward.deleteOne();
};

/**
 * Get rewards by type
 */
export const getRewardsByTypeService = async (type: RewardType): Promise<IReward[]> => {
  return Reward.find({ type, isActive: true });
};

/**
 * Get active rewards
 */
export const getActiveRewardsService = async (): Promise<IReward[]> => {
  const now = new Date();
  return Reward.find({
    isActive: true,
    $or: [
      { expiryDate: { $gt: now } },
      { expiryDate: null }
    ]
  });
}; 