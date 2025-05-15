import { Request, Response } from "express";
import { catchAsyncError } from "../../../utils/api.catcher";
import { ApiResponse } from "../../../utils/api.response";
import * as preferencesService from "./service";
import { IUser } from "../type";

/**
 * Create or update user preferences
 */
export const createOrUpdatePreferences = catchAsyncError(async (req: Request | any, res: Response) => {
  const preferences = await preferencesService.createOrUpdatePreferencesService(req.user._id, req.body);
  ApiResponse.success(res, { preferences }, "Preferences updated successfully");
});

/**
 * Get user preferences
 */
export const getUserPreferences = catchAsyncError(async (req: Request | any, res: Response) => {
  const preferences = await preferencesService.getUserPreferencesService(req.user._id);
  ApiResponse.success(res, { preferences }, "Preferences fetched successfully");
});

/**
 * Generate preferences using AI
 */
export const generatePreferences = catchAsyncError(async (req: Request | any, res: Response) => {
  const preferences = await preferencesService.generatePreferencesService(req.user._id, {
    name: req.user.name,
    email: req.user.email,
    ...req.body
  });
  ApiResponse.success(res, { preferences }, "Preferences generated successfully");
});

/**
 * Update specific preference fields
 */
export const updatePreferenceFields = catchAsyncError(async (req: Request | any, res: Response) => {
  const preferences = await preferencesService.updatePreferenceFieldsService(req.user._id, req.body);
  ApiResponse.success(res, { preferences }, "Preferences updated successfully");
});

/**
 * Get preferences by category
 */
export const getPreferencesByCategory = catchAsyncError(async (req: Request | any, res: Response) => {
  const { category } = req.params;
  const preferences = await preferencesService.getPreferencesByCategoryService(category);
  ApiResponse.success(res, { preferences }, "Preferences fetched successfully");
}); 

/**
 * Get preferences by reading level
 */
export const getPreferencesByReadingLevel = catchAsyncError(async (req: Request | any, res: Response) => {
  const { level } = req.params;
  const preferences = await preferencesService.getPreferencesByReadingLevelService(level);
  ApiResponse.success(res, { preferences }, "Preferences fetched successfully");
}); 