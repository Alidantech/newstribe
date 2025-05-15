import { Tag } from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { ITag } from "./type";

/**
 * Create a new tag
 */
export const createTagService = async (tagData: Partial<ITag>): Promise<ITag> => {
  // Check if tag with same name exists
  const existingTag = await Tag.findOne({ name: tagData.name?.toLowerCase() });
  if (existingTag) {
    throw new ApiError(400, "Tag with this name already exists");
  }

  const tag = await Tag.create(tagData);
  return tag;
};

/**
 * Get all tags
 */
export const getAllTagsService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Tag.find(), query).filteration().sort().pagination();

  const tags = await apiFeatures.getPaginatedData<ITag>("tags");
  return tags;
};

/**
 * Get tag by ID
 */
export const getTagByIdService = async (tagId: string): Promise<ITag> => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }
  return tag;
};

/**
 * Get tag by name
 */
export const getTagByNameService = async (name: string): Promise<ITag> => {
  let tag: any = await Tag.findOne({ name: name.toLowerCase() });

  // if tag not found, create tag
  if (!tag) {
    // create tag
    tag = await createTagService({
      name: name.toLowerCase(),
      description: name.toLowerCase(),
    });
  }
  
  // increment tag usage
  return tag;
};

/**
 * Update tag
 */
export const updateTagService = async (tagId: string, updateData: Partial<ITag>): Promise<ITag> => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  // Check name uniqueness if name is being updated
  if (updateData.name && updateData.name.toLowerCase() !== tag.name) {
    const existingTag = await Tag.findOne({ name: updateData.name.toLowerCase() });
    if (existingTag) {
      throw new ApiError(400, "Tag with this name already exists");
    }
  }

  Object.assign(tag, updateData);
  await tag.save();

  return tag;
};

/**
 * Delete tag
 */
export const deleteTagService = async (tagId: string): Promise<void> => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  await tag.deleteOne();
};

/**
 * Get active tags
 */
export const getActiveTagsService = async (): Promise<ITag[]> => {
  return Tag.find({ isActive: true });
};

/**
 * Get popular tags
 */
export const getPopularTagsService = async (limit: number = 10): Promise<ITag[]> => {
  return Tag.find({ isActive: true }).sort({ usageCount: -1 }).limit(limit);
};

/**
 * Increment tag usage count
 */
export const incrementTagUsageService = async (tagId: string): Promise<ITag> => {
  const tag = await Tag.findById(tagId);
  if (!tag) {
    throw new ApiError(404, "Tag not found");
  }

  tag.usageCount += 1;
  await tag.save();

  return tag;
};
