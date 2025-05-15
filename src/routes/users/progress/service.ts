import { UserProgress } from "./model";
import { ApiError } from "../../../utils/api.errors";
import { ApiFeatures } from "../../../utils/api.features";
import { IUserProgress } from "./type";
import { Content } from "../../content/model";
import { addUserPointsService } from "../points/service";
import { PointsSource } from "../points/type";

/**
 * Update user progress for content
 */
export const updateUserProgressService = async (
  userId: string,
  contentId: string,
  progress: number
): Promise<IUserProgress> => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  let userProgress = await UserProgress.findOne({ user: userId, content: contentId });
  if (!userProgress) {
    userProgress = await UserProgress.create({
      user: userId,
      content: contentId,
      progress,
      pointsEarned: 0,
    });
  } else {
    userProgress.progress = progress;
    if (progress >= 50 && content.isSponsored) {
      userProgress.pointsEarned = content.points;
    }
    await userProgress.save();
  }

  // Update user points if progress is complete
  if (progress >= 100 && !userProgress.completed) {
    userProgress.completed = true;
    await userProgress.save();
    await addUserPointsService(
      userId,
      content.points,
      PointsSource.CONTENT_READ,
      `Completed ${content.title}`
    );
  }

  return userProgress;
};

/**
 * Get user progress for specific content
 */
export const getUserProgressService = async (
  userId: string,
  contentId: string
): Promise<IUserProgress> => {
  const userProgress = await UserProgress.findOne({ user: userId, content: contentId });
  if (!userProgress) {
    throw new ApiError(404, "Progress not found");
  }
  return userProgress;
};

/**
 * Get all progress for a user
 */
export const getAllUserProgressService = async (userId: string, query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(
    UserProgress.find({ user: userId }).populate("content"),
    query
  )
    .filteration()
    .sort()
    .pagination();

  const progress = await apiFeatures.getPaginatedData<IUserProgress>("progress");
  return progress;
};

/**
 * Update quiz score
 */
export const updateQuizScoreService = async (
  userId: string,
  contentId: string,
  score: number
): Promise<IUserProgress> => {
  const userProgress = await UserProgress.findOne({ user: userId, content: contentId });
  if (!userProgress) {
    throw new ApiError(404, "Progress not found");
  }

  userProgress.quizScore = score;
  await userProgress.save();

  // Award points based on quiz score
  const content = await Content.findById(contentId);
  if (content) {
    const pointsEarned = Math.floor((score / 100) * content.points);
    await addUserPointsService(
      userId,
      pointsEarned,
      PointsSource.QUIZ_COMPLETION,
      `Completed quiz for ${content.title}`
    );
  }

  return userProgress;
}; 