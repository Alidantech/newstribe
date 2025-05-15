import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as tagsService from "./service";

/**
 * Create a new tag
 */
export const createTag = catchAsyncError(async (req: Request, res: Response) => {
  const tag = await tagsService.createTagService(req.body);
  ApiResponse.success(res, { tag }, "Tag created successfully");
});

/**
 * Get all tags
 */
export const getAllTags = catchAsyncError(async (req: Request, res: Response) => {
  const tags = await tagsService.getAllTagsService(req.query);
  ApiResponse.success(res, tags, "Tags fetched successfully");
});

/**
 * Get tag by ID
 */
export const getTagById = catchAsyncError(async (req: Request, res: Response) => {
  const { tagId } = req.params;
  const tag = await tagsService.getTagByIdService(tagId);
  ApiResponse.success(res, { tag }, "Tag fetched successfully");
});

/**
 * Update tag
 */
export const updateTag = catchAsyncError(async (req: Request, res: Response) => {
  const { tagId } = req.params;
  const tag = await tagsService.updateTagService(tagId, req.body);
  ApiResponse.success(res, { tag }, "Tag updated successfully");
});

/**
 * Delete tag
 */
export const deleteTag = catchAsyncError(async (req: Request, res: Response) => {
  const { tagId } = req.params;
  await tagsService.deleteTagService(tagId);
  ApiResponse.success(res, null, "Tag deleted successfully");
});

/**
 * Get active tags
 */
export const getActiveTags = catchAsyncError(async (req: Request, res: Response) => {
  const tags = await tagsService.getActiveTagsService();
  ApiResponse.success(res, { tags }, "Active tags fetched successfully");
});

/**
 * Get popular tags
 */
export const getPopularTags = catchAsyncError(async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const tags = await tagsService.getPopularTagsService(limit);
  ApiResponse.success(res, { tags }, "Popular tags fetched successfully");
}); 