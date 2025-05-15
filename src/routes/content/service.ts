import { Content } from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IContent } from "./type";
import { createContentTagService } from "./tags/service";

/**
 * Content Services
 */

export const createContentService = async (
  contentData: Partial<
    IContent & {
      tags: string[];
    }
  >
): Promise<IContent> => {
  const content = await Content.create(contentData);

  // Create content tags
  if (contentData.tags) {
    await Promise.all(
      contentData.tags.map((tagId) =>
        createContentTagService({
          content: content._id as any,
          tag: tagId as any,
        })
      )
    );
  }

  return content;
};

export const getContentByIdService = async (id: string): Promise<IContent> => {
  const content = await Content.findById(id);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }
  return content;
};

export const updateContentService = async (
  id: string,
  updateData: Partial<IContent>
): Promise<IContent> => {
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
