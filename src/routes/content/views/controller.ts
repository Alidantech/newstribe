import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as viewsService from "./service";
import { IUser } from "../../users/type";

/**
 * Create a new view
 */
export const createView = catchAsyncError(async (req: Request & { user: IUser }, res: Response) => {
  const view = await viewsService.createViewService({
    ...req.body,
    user: req.user._id
  });
  ApiResponse.success(res, { view }, "Content viewed successfully");
});

/**
 * Get all views
 */
export const getAllViews = catchAsyncError(async (req: Request, res: Response) => {
  const views = await viewsService.getAllViewsService(req.query);
  ApiResponse.success(res, views, "Views fetched successfully");
});

/**
 * Get view by ID
 */
export const getViewById = catchAsyncError(async (req: Request, res: Response) => {
  const { viewId } = req.params;
  const view = await viewsService.getViewByIdService(viewId);
  ApiResponse.success(res, { view }, "View fetched successfully");
});

/**
 * Delete view
 */
export const deleteView = catchAsyncError(async (req: Request, res: Response) => {
  const { viewId } = req.params;
  await viewsService.deleteViewService(viewId);
  ApiResponse.success(res, null, "View removed successfully");
});

/**
 * Get views by content ID
 */
export const getViewsByContent = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const views = await viewsService.getViewsByContentService(contentId);
  ApiResponse.success(res, { views }, "Views fetched successfully");
});

/**
 * Get views by user ID
 */
export const getViewsByUser = catchAsyncError(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const views = await viewsService.getViewsByUserService(userId);
  ApiResponse.success(res, { views }, "Views fetched successfully");
});

/**
 * Check if user has viewed content
 */
export const checkUserView = catchAsyncError(async (req: Request | any, res: Response) => {
  const { contentId } = req.params;
  const hasViewed = await viewsService.checkUserViewService(req?.user?._id, contentId);
  ApiResponse.success(res, { hasViewed }, "View status checked successfully");
});

/**
 * Get view count for content
 */
export const getViewCount = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const count = await viewsService.getViewCountService(contentId);
  ApiResponse.success(res, { count }, "View count fetched successfully");
}); 