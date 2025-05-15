import {
  Content} from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IContent } from "./type";

/**
 * Content Services
 */

export const createContentService = async (contentData: Partial<IContent>): Promise<IContent> => {
  const content = await Content.create(contentData);
  return content;
};

export const getContentByIdService = async (id: string): Promise<IContent> => {
  const content = await Content.findById(id);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  return content;
};

export const updateContentService = async (id: string, updateData: Partial<IContent>): Promise<IContent> => {
  const content = await Content.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  return content;
};

export const deleteContentService = async (id: string): Promise<void> => {
  const content = await Content.findByIdAndDelete(id);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
};

export const getAllContentService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Content.find().lean(), query)
    .search()
    .filteration()
    .sort()
    .pagination();

  const contents = await apiFeatures.getPaginatedData<IContent>("contents");
  return contents;
};
