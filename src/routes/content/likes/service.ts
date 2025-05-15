import { Like } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { ILike } from "./type";

/**
 * Create a new like
 */
export const createLikeService = async (likeData: Partial<ILike>): Promise<ILike> => {
  // Check if like already exists
  const existingLike = await Like.findOne({
    user: likeData.user,
    content: likeData.content
  });

  if (existingLike) {
    throw new ApiError(400, "You have already liked this content");
  }

  const like = await Like.create(likeData);
  return like.populate("user", "name email avatar");
};

/**
 * Get all likes
 */
export const getAllLikesService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Like.find(), query)
    .filteration()
    .sort()
    .pagination();

  const likes = await apiFeatures.getPaginatedData<ILike>("likes");
  return likes;
};

/**
 * Get like by ID
 */
export const getLikeByIdService = async (likeId: string): Promise<ILike> => {
  const like = await Like.findById(likeId).populate("user", "name email avatar");
  if (!like) {
    throw new ApiError(404, "Like not found");
  }
  return like;
};

/**
 * Delete like
 */
export const deleteLikeService = async (likeId: string): Promise<void> => {
  const like = await Like.findById(likeId);
  if (!like) {
    throw new ApiError(404, "Like not found");
  }

  await like.deleteOne();
};

/**
 * Get likes by content ID
 */
export const getLikesByContentService = async (contentId: string): Promise<ILike[]> => {
  return Like.find({ content: contentId })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });
};

/**
 * Get likes by user ID
 */
export const getLikesByUserService = async (userId: string): Promise<ILike[]> => {
  return Like.find({ user: userId })
    .populate("content", "title")
    .sort({ createdAt: -1 });
};

/**
 * Check if user has liked content
 */
export const checkUserLikeService = async (userId: string, contentId: string): Promise<boolean> => {
  const like = await Like.findOne({ user: userId, content: contentId });
  return !!like;
};

/**
 * Get like count for content
 */
export const getLikeCountService = async (contentId: string): Promise<number> => {
  return Like.countDocuments({ content: contentId });
}; 