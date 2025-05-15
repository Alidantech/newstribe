import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as badgesService from "./service";

/**
 * Create a new badge
 */
export const createBadge = catchAsyncError(async (req: Request, res: Response) => {
  const badge = await badgesService.createBadgeService(req.body);
  ApiResponse.success(res, { badge }, "Badge created successfully");
});

/**
 * Get all badges
 */
export const getAllBadges = catchAsyncError(async (req: Request, res: Response) => {
  const badges = await badgesService.getAllBadgesService(req.query);
  ApiResponse.success(res, badges, "Badges fetched successfully");
});

/**
 * Get badge by ID
 */
export const getBadgeById = catchAsyncError(async (req: Request, res: Response) => {
  const { badgeId } = req.params;
  const badge = await badgesService.getBadgeByIdService(badgeId);
  ApiResponse.success(res, { badge }, "Badge fetched successfully");
});

/**
 * Update badge
 */
export const updateBadge = catchAsyncError(async (req: Request, res: Response) => {
  const { badgeId } = req.params;
  const badge = await badgesService.updateBadgeService(badgeId, req.body);
  ApiResponse.success(res, { badge }, "Badge updated successfully");
});

/**
 * Delete badge
 */
export const deleteBadge = catchAsyncError(async (req: Request, res: Response) => {
  const { badgeId } = req.params;
  await badgesService.deleteBadgeService(badgeId);
  ApiResponse.success(res, null, "Badge deleted successfully");
});

/**
 * Get badges by criteria
 */
export const getBadgesByCriteria = catchAsyncError(async (req: Request, res: Response) => {
  const { type, value } = req.query;
  const badges = await badgesService.getBadgesByCriteriaService(
    type as string,
    Number(value)
  );
  ApiResponse.success(res, { badges }, "Badges fetched successfully");
}); 