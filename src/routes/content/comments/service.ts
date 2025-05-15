import Comment from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IComment } from "./type";

/**
 * Create a new comment
 */
export const createCommentService = async (commentData: Partial<IComment>): Promise<IComment> => {
  const comment = await Comment.create(commentData);
  return comment.populate("user", "name email avatar");
};

/**
 * Get all comments
 */
export const getAllCommentsService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Comment.find(), query)
    .filteration()
    .sort()
    .pagination();

  const comments = await apiFeatures.getPaginatedData<IComment>("comments");
  return comments;
};

/**
 * Get comment by ID
 */
export const getCommentByIdService = async (commentId: string): Promise<IComment> => {
  const comment = await Comment.findById(commentId).populate("user", "name email avatar");
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  return comment;
};

/**
 * Update comment
 */
export const updateCommentService = async (
  commentId: string,
  updateData: Partial<IComment>
): Promise<IComment> => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  Object.assign(comment, updateData);
  await comment.save();

  return comment.populate("user", "name email avatar");
};

/**
 * Delete comment
 */
export const deleteCommentService = async (commentId: string): Promise<void> => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  await comment.deleteOne();
};

/**
 * Get comments by content ID
 */
export const getCommentsByContentService = async (contentId: string): Promise<IComment[]> => {
  return Comment.find({ content: contentId })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });
};

/**
 * Get comments by user ID
 */
export const getCommentsByUserService = async (userId: string): Promise<IComment[]> => {
  return Comment.find({ user: userId })
    .populate("content", "title")
    .sort({ createdAt: -1 });
}; 