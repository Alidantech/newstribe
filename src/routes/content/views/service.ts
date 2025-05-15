import { View } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IView } from "./type";

/**
 * Create a new view
 */
export const createViewService = async (viewData: Partial<IView>): Promise<IView> => {
  // Check if view already exists
  const existingView = await View.findOne({
    user: viewData.user,
    content: viewData.content,
  });

  if (existingView) {
    // Update the timestamp of the existing view
    existingView.updatedAt = new Date();
    await existingView.save();
    return existingView.populate("user", "name email avatar");
  }

  const view = await View.create(viewData);
  return view.populate("user", "name email avatar");
};

/**
 * Get all views
 */
export const getAllViewsService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(View.find(), query).filteration().sort().pagination();

  const views = await apiFeatures.getPaginatedData<IView>("views");
  return views;
};

/**
 * Get view by ID
 */
export const getViewByIdService = async (viewId: string): Promise<IView> => {
  const view = await View.findById(viewId).populate("user", "name email avatar");
  if (!view) {
    throw new ApiError(404, "View not found");
  }
  return view;
};

/**
 * Delete view
 */
export const deleteViewService = async (viewId: string): Promise<void> => {
  const view = await View.findById(viewId);
  if (!view) {
    throw new ApiError(404, "View not found");
  }

  await view.deleteOne();
};

/**
 * Get views by content ID
 */
export const getViewsByContentService = async (contentId: string): Promise<IView[]> => {
  return View.find({ content: contentId })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 });
};

/**
 * Get views by user ID
 */
export const getViewsByUserService = async (userId: string): Promise<IView[]> => {
  return View.find({ user: userId }).populate("content", "title").sort({ createdAt: -1 });
};

/**
 * Check if user has viewed content
 */
export const checkUserViewService = async (userId: string, contentId: string): Promise<boolean> => {
  const view = await View.findOne({ user: userId, content: contentId });
  return !!view;
};

/**
 * Get view count for content
 */
export const getViewCountService = async (contentId: string): Promise<number> => {
  return View.countDocuments({ content: contentId });
};
