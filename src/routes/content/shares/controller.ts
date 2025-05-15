import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as sharesService from "./service";
import { IUser } from "../../users/type";

/**
 * Create a new share
 */
export const createShare = catchAsyncError(async (req: Request & { user: IUser }, res: Response) => {
  const share = await sharesService.createShareService({
    ...req.body,
    user: req.user._id
  });
  ApiResponse.success(res, { share }, "Content shared successfully");
});

/**
 * Get all shares
 */
export const getAllShares = catchAsyncError(async (req: Request, res: Response) => {
  const shares = await sharesService.getAllSharesService(req.query);
  ApiResponse.success(res, shares, "Shares fetched successfully");
});

/**
 * Get share by ID
 */
export const getShareById = catchAsyncError(async (req: Request, res: Response) => {
  const { shareId } = req.params;
  const share = await sharesService.getShareByIdService(shareId);
  ApiResponse.success(res, { share }, "Share fetched successfully");
});

/**
 * Delete share
 */
export const deleteShare = catchAsyncError(async (req: Request, res: Response) => {
  const { shareId } = req.params;
  await sharesService.deleteShareService(shareId);
  ApiResponse.success(res, null, "Share removed successfully");
});

/**
 * Get shares by content ID
 */
export const getSharesByContent = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const shares = await sharesService.getSharesByContentService(contentId);
  ApiResponse.success(res, { shares }, "Shares fetched successfully");
});

/**
 * Get shares by user ID
 */
export const getSharesByUser = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const shares = await sharesService.getSharesByUserService(userId);
  ApiResponse.success(res, { shares }, "Shares fetched successfully");
});

/**
 * Check if user has shared content
 */
export const checkUserShare = catchAsyncError(async (req: Request | any, res: Response) => {
  const { contentId } = req.params;
  const hasShared = await sharesService.checkUserShareService(req?.user?._id, contentId);
  ApiResponse.success(res, { hasShared }, "Share status checked successfully");
});

/**
 * Get share count for content
 */
export const getShareCount = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const count = await sharesService.getShareCountService(contentId);
  ApiResponse.success(res, { count }, "Share count fetched successfully");
}); 