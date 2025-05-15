import { UserPreferences } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserPreferences, ContentCategory, ContentFormat, ReadingLevel, NotificationPreference } from "./type";
import { AIGenerator } from "../../../utils/ai";

/**
 * Create or update user preferences
 */
export const createOrUpdatePreferencesService = async (
  userId: string,
  preferences: Partial<IUserPreferences>
): Promise<IUserPreferences> => {
  const userPreferences = await UserPreferences.findOneAndUpdate(
    { user: userId },
    { ...preferences, user: userId },
    { new: true, upsert: true }
  );
  return userPreferences;
};

/**
 * Get user preferences
 */
export const getUserPreferencesService = async (userId: string): Promise<IUserPreferences> => {
  const preferences = await UserPreferences.findOne({ user: userId });
  if (!preferences) {
    throw new ApiError(404, "User preferences not found");
  }
  return preferences;
};

/**
 * Generate preferences using AI
 */
export const generatePreferencesService = async (
  userId: string,
  userData: {
    name: string;
    email: string;
    viewedContent?: Array<{
      title: string;
      type: string;
      category: string;
    }>;
    completedQuizzes?: Array<{
      title: string;
      score: number;
      difficulty: string;
    }>;
    sharedContent?: Array<{
      title: string;
      type: string;
      category: string;
    }>;
  }
): Promise<IUserPreferences> => {
  const generatedPreferences = await AIGenerator.generateUserPreferences(userData);
  
  const preferences = await UserPreferences.findOneAndUpdate(
    { user: userId },
    { ...generatedPreferences, user: userId },
    { new: true, upsert: true }
  );
  
  return preferences;
};

/**
 * Update specific preference fields
 */
export const updatePreferenceFieldsService = async (
  userId: string,
  updates: Partial<IUserPreferences>
): Promise<IUserPreferences> => {
  const preferences = await UserPreferences.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    { new: true }
  );
  
  if (!preferences) {
    throw new ApiError(404, "User preferences not found");
  }
  
  return preferences;
};

/**
 * Get preferences by category
 */
export const getPreferencesByCategoryService = async (
  category: ContentCategory
): Promise<IUserPreferences[]> => {
  return UserPreferences.find({ categories: category });
};

/**
 * Get preferences by reading level
 */
export const getPreferencesByReadingLevelService = async (
  readingLevel: ReadingLevel
): Promise<IUserPreferences[]> => {
  return UserPreferences.find({ readingLevel });
}; 