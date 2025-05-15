import { Share } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IShare } from "./type";

/**
 * Create a new share
 */
export const createShareService = async (shareData: Partial<IShare>): Promise<IShare> => {
  // Check if share already exists
  const existingShare = await Share.findOne({
    user: shareData.user,
    content: shareData.content,
  });

  if (existingShare) {
    throw new ApiError(400, "You have already shared this content");
  }

  const share = await Share.create(shareData);
  return share.populate("user", "name email avatar");
};

/**
 * Get all shares
 */
export const getAllSharesService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Share.find(), query).filteration().sort().pagination();

  const shares = await apiFeatures.getPaginatedData<IShare>("shares");
  return shares;
};

/**
 * Get share by ID
 */
export const getShareByIdService = async (shareId: string): Promise<IShare> => {
  const share = await Share.findById(shareId).populate("user", "name email avatar");
  if (!share) {
    throw new ApiError(404, "Share not found");
  }
  return share;
};

/**
 * Delete share
 */
export const deleteShareService = async (shareId: string): Promise<void> => {
  const share = await Share.findById(shareId);
  if (!share) {
    throw new ApiError(404, "Share not found");
  }

  await share.deleteOne();
};

/**
 * Get shares by content ID
 */
export const getSharesByContentService = async (contentId: string): Promise<IShare[]> => {
  return Share.find({ content: contentId })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });
};

/**
 * Get shares by user ID
 */
export const getSharesByUserService = async (userId: string): Promise<IShare[]> => {
  return Share.find({ user: userId }).populate("content", "title").sort({ createdAt: -1 });
};

/**
 * Check if user has shared content
 */
export const checkUserShareService = async (
  userId: string,
  contentId: string
): Promise<boolean> => {
  const share = await Share.findOne({ user: userId, content: contentId });
  return !!share;
};

/**
 * Get share count for content
 */
export const getShareCountService = async (contentId: string): Promise<number> => {
  return Share.countDocuments({ content: contentId });
};
