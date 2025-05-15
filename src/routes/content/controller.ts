import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as contentService from "./service";

/**
 * Content Controllers
 */

export const createContent = catchAsyncError(async (req: Request, res: Response) => {
  const content = await contentService.createContentService(req.body);
  ApiResponse.success(res, { content }, "Content created successfully");
});

export const getContentById = catchAsyncError(async (req: Request, res: Response) => {
  const content = await contentService.getContentByIdService(req.params.id);
  ApiResponse.success(res, { content }, "Content fetched successfully");
});

export const updateContent = catchAsyncError(async (req: Request, res: Response) => {
  const content = await contentService.updateContentService(req.params.id, req.body);
  ApiResponse.success(res, { content }, "Content updated successfully");
});

export const deleteContent = catchAsyncError(async (req: Request, res: Response) => {
  await contentService.deleteContentService(req.params.id);
  ApiResponse.success(res, null, "Content deleted successfully");
});

export const getAllContent = catchAsyncError(async (req: Request, res: Response) => {
  const contents = await contentService.getAllContentService(req.query);
  ApiResponse.success(res, contents, "Contents fetched successfully");
});
