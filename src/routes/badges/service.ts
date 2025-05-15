import { Badge } from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IBadge } from "./type";

/**
 * Create a new badge
 */
export const createBadgeService = async (badgeData: Partial<IBadge>): Promise<IBadge> => {
  const existingBadge = await Badge.findOne({ name: badgeData.name });
  if (existingBadge) {
    throw new ApiError(400, "Badge with this name already exists");
  }

  const badge = await Badge.create(badgeData);
  return badge;
};

/**
 * Get all badges
 */
export const getAllBadgesService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Badge.find(), query)
    .filteration()
    .sort()
    .pagination();

  const badges = await apiFeatures.getPaginatedData<IBadge>("badges");
  return badges;
};

/**
 * Get badge by ID
 */
export const getBadgeByIdService = async (badgeId: string): Promise<IBadge> => {
  const badge = await Badge.findById(badgeId);
  if (!badge) {
    throw new ApiError(404, "Badge not found");
  }
  return badge;
};

/**
 * Update badge
 */
export const updateBadgeService = async (
  badgeId: string,
  updateData: Partial<IBadge>
): Promise<IBadge> => {
  const badge = await Badge.findById(badgeId);
  if (!badge) {
    throw new ApiError(404, "Badge not found");
  }

  // Check if name is being updated and if it's already taken
  if (updateData.name && updateData.name !== badge.name) {
    const existingBadge = await Badge.findOne({ name: updateData.name });
    if (existingBadge) {
      throw new ApiError(400, "Badge with this name already exists");
    }
  }

  Object.assign(badge, updateData);
  await badge.save();

  return badge;
};

/**
 * Delete badge
 */
export const deleteBadgeService = async (badgeId: string): Promise<void> => {
  const badge = await Badge.findById(badgeId);
  if (!badge) {
    throw new ApiError(404, "Badge not found");
  }

  await badge.deleteOne();
};

/**
 * Get badges by criteria
 */
export const getBadgesByCriteriaService = async (
  criteriaType: string,
  value: number
): Promise<IBadge[]> => {
  return Badge.find({
    "criteria.type": criteriaType,
    "criteria.value": { $lte: value },
    isActive: true
  });
}; 