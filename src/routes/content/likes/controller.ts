import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as likesService from "./service";
import { IUser } from "../../users/type";

/**
 * Create a new like
 */
export const createLike = catchAsyncError(async (req: Request & { user: IUser }, res: Response) => {
  const like = await likesService.createLikeService({
    ...req.body,
    user: req.user._id,
  });
  ApiResponse.success(res, { like }, "Content liked successfully");
});

/**
 * Get all likes
 */
export const getAllLikes = catchAsyncError(async (req: Request, res: Response) => {
  const likes = await likesService.getAllLikesService(req.query);
  ApiResponse.success(res, likes, "Likes fetched successfully");
});

/**
 * Get like by ID
 */
export const getLikeById = catchAsyncError(async (req: Request, res: Response) => {
  const { likeId } = req.params;
  const like = await likesService.getLikeByIdService(likeId);
  ApiResponse.success(res, { like }, "Like fetched successfully");
});

/**
 * Delete like
 */
export const deleteLike = catchAsyncError(async (req: Request, res: Response) => {
  const { likeId } = req.params;
  await likesService.deleteLikeService(likeId);
  ApiResponse.success(res, null, "Like removed successfully");
});

/**
 * Get likes by content ID
 */
export const getLikesByContent = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const likes = await likesService.getLikesByContentService(contentId);
  ApiResponse.success(res, { likes }, "Likes fetched successfully");
});

/**
 * Get likes by user ID
 */
export const getLikesByUser = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const likes = await likesService.getLikesByUserService(userId);
  ApiResponse.success(res, { likes }, "Likes fetched successfully");
});

/**
 * Check if user has liked content
 */
export const checkUserLike = catchAsyncError(async (req: Request | any, res: Response) => {
  const { contentId } = req.params;
  const hasLiked = await likesService.checkUserLikeService(req?.user?._id, contentId);
  ApiResponse.success(res, { hasLiked }, "Like status checked successfully");
});

/**
 * Get like count for content
 */
export const getLikeCount = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const count = await likesService.getLikeCountService(contentId);
  ApiResponse.success(res, { count }, "Like count fetched successfully");
});
