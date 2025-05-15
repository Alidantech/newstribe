import { Sponsor } from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { ISponsor } from "./type";

/**
 * Create a new sponsor
 */
export const createSponsorService = async (sponsorData: Partial<ISponsor>): Promise<ISponsor> => {
  // Check if sponsor with same name exists
  const existingSponsor = await Sponsor.findOne({ name: sponsorData.name });
  if (existingSponsor) {
    throw new ApiError(400, "Sponsor with this name already exists");
  }

  // Check if sponsor with same email exists
  const existingEmail = await Sponsor.findOne({ contactEmail: sponsorData.contactEmail });
  if (existingEmail) {
    throw new ApiError(400, "Sponsor with this email already exists");
  }

  const sponsor = await Sponsor.create(sponsorData);
  return sponsor;
};

/**
 * Get all sponsors
 */
export const getAllSponsorsService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Sponsor.find(), query)
    .filteration()
    .sort()
    .pagination();

  const sponsors = await apiFeatures.getPaginatedData<ISponsor>("sponsors");
  return sponsors;
};

/**
 * Get sponsor by ID
 */
export const getSponsorByIdService = async (sponsorId: string): Promise<ISponsor> => {
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw new ApiError(404, "Sponsor not found");
  }
  return sponsor;
};

/**
 * Update sponsor
 */
export const updateSponsorService = async (
  sponsorId: string,
  updateData: Partial<ISponsor>
): Promise<ISponsor> => {
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw new ApiError(404, "Sponsor not found");
  }

  // Check name uniqueness if name is being updated
  if (updateData.name && updateData.name !== sponsor.name) {
    const existingSponsor = await Sponsor.findOne({ name: updateData.name });
    if (existingSponsor) {
      throw new ApiError(400, "Sponsor with this name already exists");
    }
  }

  // Check email uniqueness if email is being updated
  if (updateData.contactEmail && updateData.contactEmail !== sponsor.contactEmail) {
    const existingEmail = await Sponsor.findOne({ contactEmail: updateData.contactEmail });
    if (existingEmail) {
      throw new ApiError(400, "Sponsor with this email already exists");
    }
  }

  Object.assign(sponsor, updateData);
  await sponsor.save();

  return sponsor;
};

/**
 * Delete sponsor
 */
export const deleteSponsorService = async (sponsorId: string): Promise<void> => {
  const sponsor = await Sponsor.findById(sponsorId);
  if (!sponsor) {
    throw new ApiError(404, "Sponsor not found");
  }

  await sponsor.deleteOne();
};

/**
 * Get active sponsors
 */
export const getActiveSponsorsService = async (): Promise<ISponsor[]> => {
  return Sponsor.find({ isActive: true });
}; 