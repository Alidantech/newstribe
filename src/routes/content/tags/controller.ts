import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as contentTagsService from "./service";

/**
 * Create a new content tag
 */
export const createContentTag = catchAsyncError(async (req: Request, res: Response) => {
  const contentTag = await contentTagsService.createContentTagService(req.body);
  ApiResponse.success(res, { contentTag }, "Tag added to content successfully");
});

/**
 * Get all content tags
 */
export const getAllContentTags = catchAsyncError(async (req: Request, res: Response) => {
  const contentTags = await contentTagsService.getAllContentTagsService(req.query);
  ApiResponse.success(res, contentTags, "Content tags fetched successfully");
});

/**
 * Get content tag by ID
 */
export const getContentTagById = catchAsyncError(async (req: Request, res: Response) => {
  const { contentTagId } = req.params;
  const contentTag = await contentTagsService.getContentTagByIdService(contentTagId);
  ApiResponse.success(res, { contentTag }, "Content tag fetched successfully");
});

/**
 * Delete content tag
 */
export const deleteContentTag = catchAsyncError(async (req: Request, res: Response) => {
  const { contentTagId } = req.params;
  await contentTagsService.deleteContentTagService(contentTagId);
  ApiResponse.success(res, null, "Tag removed from content successfully");
});

/**
 * Get tags by content ID
 */
export const getTagsByContent = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const contentTags = await contentTagsService.getTagsByContentService(contentId);
  ApiResponse.success(res, { contentTags }, "Content tags fetched successfully");
});

/**
 * Get content by tag ID
 */
export const getContentByTag = catchAsyncError(async (req: Request, res: Response) => {
  const { tagId } = req.params;
  const contentTags = await contentTagsService.getContentByTagService(tagId);
  ApiResponse.success(res, { contentTags }, "Content tags fetched successfully");
});

/**
 * Add multiple tags to content
 */
export const addMultipleTags = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const { tagIds } = req.body;
  const contentTags = await contentTagsService.addMultipleTagsService(contentId, tagIds);
  ApiResponse.success(res, { contentTags }, "Tags added to content successfully");
});

/**
 * Remove multiple tags from content
 */
export const removeMultipleTags = catchAsyncError(async (req: Request, res: Response) => {
  const { contentId } = req.params;
  const { tagIds } = req.body;
  await contentTagsService.removeMultipleTagsService(contentId, tagIds);
  ApiResponse.success(res, null, "Tags removed from content successfully");
}); 