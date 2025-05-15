import { Request, Response } from "express";
import { catchAsyncError } from "../../utils/api.catcher";
import { ApiResponse } from "../../utils/api.response";
import * as sponsorsService from "./service";

/**
 * Create a new sponsor
 */
export const createSponsor = catchAsyncError(async (req: Request, res: Response) => {
  const sponsor = await sponsorsService.createSponsorService(req.body);
  ApiResponse.success(res, { sponsor }, "Sponsor created successfully");
});

/**
 * Get all sponsors
 */
export const getAllSponsors = catchAsyncError(async (req: Request, res: Response) => {
  const sponsors = await sponsorsService.getAllSponsorsService(req.query);
  ApiResponse.success(res, sponsors, "Sponsors fetched successfully");
});

/**
 * Get sponsor by ID
 */
export const getSponsorById = catchAsyncError(async (req: Request, res: Response) => {
  const { sponsorId } = req.params;
  const sponsor = await sponsorsService.getSponsorByIdService(sponsorId);
  ApiResponse.success(res, { sponsor }, "Sponsor fetched successfully");
});

/**
 * Update sponsor
 */
export const updateSponsor = catchAsyncError(async (req: Request, res: Response) => {
  const { sponsorId } = req.params;
  const sponsor = await sponsorsService.updateSponsorService(sponsorId, req.body);
  ApiResponse.success(res, { sponsor }, "Sponsor updated successfully");
});

/**
 * Delete sponsor
 */
export const deleteSponsor = catchAsyncError(async (req: Request, res: Response) => {
  const { sponsorId } = req.params;
  await sponsorsService.deleteSponsorService(sponsorId);
  ApiResponse.success(res, null, "Sponsor deleted successfully");
});

/**
 * Get active sponsors
 */
export const getActiveSponsors = catchAsyncError(async (req: Request, res: Response) => {
  const sponsors = await sponsorsService.getActiveSponsorsService();
  ApiResponse.success(res, { sponsors }, "Active sponsors fetched successfully");
}); 