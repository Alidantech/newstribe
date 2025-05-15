import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as badgesService from "./service";

/**
 * Award badge to user
 */
export const awardBadge = catchAsyncError(async (req: Request | any, res: Response) => {
  const { badgeId } = req.body;
  const userBadge = await badgesService.awardBadgeToUserService(req.user._id, badgeId);
  ApiResponse.success(res, { userBadge }, "Badge awarded successfully");
});

/**
 * Get user badges
 */
export const getUserBadges = catchAsyncError(async (req: Request | any, res: Response) => {
  const badges = await badgesService.getUserBadgesService(req.user._id, req.query);
  ApiResponse.success(res, badges, "Badges fetched successfully");
});

/**
 * Check if user has a specific badge
 */
export const checkUserBadge = catchAsyncError(async (req: Request | any, res: Response) => {
  const { badgeId } = req.params;
  const hasBadge = await badgesService.checkUserBadgeService(req.user._id, badgeId);
  ApiResponse.success(res, { hasBadge }, "Badge check completed successfully");
});

/**
 * Get user badge count
 */
export const getUserBadgeCount = catchAsyncError(async (req: Request | any, res: Response) => {
  const count = await badgesService.getUserBadgeCountService(req.user._id);
  ApiResponse.success(res, { count }, "Badge count fetched successfully");
}); 