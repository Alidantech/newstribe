import { ContentTag } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IContentTag } from "./type";
import { Tag } from "../../tags/model";
import { IContent } from "../type";
import { ITag } from "../../tags/type";

/**
 * Create a new content tag
 */
export const createContentTagService = async (
  contentTagData: Partial<IContentTag>
): Promise<IContentTag> => {
  // Check if tag exists
  const tag = await Tag.findById(contentTagData.tag);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  // Check if content-tag combination already exists
  const existingContentTag = await ContentTag.findOne({
    content: contentTagData.content,
    tag: contentTagData.tag,
  });

  if (existingContentTag) {
    throw new ApiError(400, "This tag is already associated with the content");
  }

  const contentTag = await ContentTag.create(contentTagData);
  return contentTag.populate("tag", "name description");
};

/**
 * Get all content tags
 */
export const getAllContentTagsService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(ContentTag.find(), query).filteration().sort().pagination();

  const contentTags = await apiFeatures.getPaginatedData<IContentTag>("contentTags");
  return contentTags;
};

/**
 * Get content tag by ID
 */
export const getContentTagByIdService = async (contentTagId: string): Promise<IContentTag> => {
  const contentTag = await ContentTag.findById(contentTagId)
    .populate("tag", "name description")
    .populate("content", "title");
  if (!contentTag) {
    throw new ApiError(404, "Content tag not found");
  }
  return contentTag;
};

/**
 * Delete content tag
 */
export const deleteContentTagService = async (contentTagId: string): Promise<void> => {
  const contentTag = await ContentTag.findById(contentTagId);
  if (!contentTag) {
    throw new ApiError(404, "Content tag not found");
  }

  await contentTag.deleteOne();
};

/**
 * Get tags by content ID
 */
export const getTagsByContentService = async (contentId: string): Promise<IContentTag[]> => {
  return ContentTag.find({ content: contentId })
    .populate("tag", "name description")
    .sort({ createdAt: -1 });
};

/**
 * Get content by tag ID
 */
export const getContentByTagService = async (tagId: string): Promise<IContentTag[]> => {
  return ContentTag.find({ tag: tagId }).populate("content", "title").sort({ createdAt: -1 });
};

/**
 * Add multiple tags to content
 */
export const addMultipleTagsService = async (
  contentId: string,
  tagIds: string[]
): Promise<IContentTag[]> => {
  const contentTags = await Promise.all(
    tagIds.map(async (tagId) => {
      try {
        return await createContentTagService({
          content: contentId as unknown as IContent,
          tag: tagId as unknown as ITag,
        });
      } catch (error) {
        // Skip if tag already exists
        return null;
      }
    })
  );

  return contentTags.filter((tag): tag is IContentTag => tag !== null);
};

/**
 * Remove multiple tags from content
 */
export const removeMultipleTagsService = async (
  contentId: string,
  tagIds: string[]
): Promise<void> => {
  await ContentTag.deleteMany({
    content: contentId,
    tag: { $in: tagIds },
  });
};
