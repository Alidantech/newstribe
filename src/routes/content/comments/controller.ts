import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as commentsService from "./service";
import { IUser } from "../../users/type";

/**
 * Create a new comment
 */
export const createComment = catchAsyncError(async (req: Request & { user: IUser }, res: Response) => {
  const comment = await commentsService.createCommentService({
    ...req.body,
    user: req.user._id
  });
  ApiResponse.success(res, { comment }, "Comment created successfully");
});

/**
 * Get all comments
 */
export const getAllComments = catchAsyncError(async (req: Request, res: Response) => {
  const comments = await commentsService.getAllCommentsService(req.query);
  ApiResponse.success(res, comments, "Comments fetched successfully");
});

/**
 * Get comment by ID
 */
export const getCommentById = catchAsyncError(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const comment = await commentsService.getCommentByIdService(commentId);
  ApiResponse.success(res, { comment }, "Comment fetched successfully");
});

/**
 * Update comment
 */
export const updateComment = catchAsyncError(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const comment = await commentsService.updateCommentService(commentId, req.body);
  ApiResponse.success(res, { comment }, "Comment updated successfully");
});

/**
 * Delete comment
 */
export const deleteComment = catchAsyncError(async (req: Request, res: Response) => {
  const { commentId } = req.params;
  await commentsService.deleteCommentService(commentId);
  ApiResponse.success(res, null, "Comment deleted successfully");
});

/**
 * Get comments by content ID
 */
export const getCommentsByContent = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const comments = await commentsService.getCommentsByContentService(contentId);
  ApiResponse.success(res, { comments }, "Comments fetched successfully");
});

/**
 * Get comments by user ID
 */
export const getCommentsByUser = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const comments = await commentsService.getCommentsByUserService(userId);
  ApiResponse.success(res, { comments }, "Comments fetched successfully");
}); 