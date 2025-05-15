import { Quiz } from "./model";
import { Content } from "../content/model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IQuiz } from "./type";

/**
 * Create a new quiz
 */
export const createQuizService = async (quizData: Partial<IQuiz>): Promise<IQuiz> => {
  // Validate content exists
  const content = await Content.findById(quizData.content);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  // Validate dates
  if (new Date(quizData.startDate!) >= new Date(quizData.endDate!)) {
    throw new ApiError(400, "Start date must be before end date");
  }

  // Validate questions
  if (!quizData.questions || quizData.questions.length === 0) {
    throw new ApiError(400, "Quiz must have at least one question");
  }

  const quiz = await Quiz.create(quizData);
  return quiz;
};

/**
 * Get all quizzes
 */
export const getAllQuizzesService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(
    Quiz.find().populate("content"),
    query
  )
    .filteration()
    .sort()
    .pagination();

  const quizzes = await apiFeatures.getPaginatedData<IQuiz>("quizzes");
  return quizzes;
};

/**
 * Get quiz by ID
 */
export const getQuizByIdService = async (quizId: string): Promise<IQuiz> => {
  const quiz = await Quiz.findById(quizId).populate("content");
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }
  return quiz;
};

/**
 * Update quiz
 */
export const updateQuizService = async (
  quizId: string,
  updateData: Partial<IQuiz>
): Promise<IQuiz> => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  // Validate dates if being updated
  if (updateData.startDate && updateData.endDate) {
    if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      throw new ApiError(400, "Start date must be before end date");
    }
  }

  Object.assign(quiz, updateData);
  await quiz.save();

  return quiz;
};

/**
 * Delete quiz
 */
export const deleteQuizService = async (quizId: string): Promise<void> => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  await quiz.deleteOne();
};

/**
 * Get active quizzes
 */
export const getActiveQuizzesService = async (): Promise<IQuiz[]> => {
  const now = new Date();
  return Quiz.find({
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate("content");
};

/**
 * Update quiz status
 */
export const updateQuizStatusService = async (
  quizId: string,
  status: string
): Promise<IQuiz> => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  quiz.status = status as "active" | "inactive" | "completed";
  await quiz.save();

  return quiz;
}; 