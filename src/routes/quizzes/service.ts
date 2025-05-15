import { Quiz } from "./model";
import { Content } from "../content/model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { IQuiz, QuizDifficulty, QuizStatus } from "./type";
import { AIGenerator } from "../../utils/ai";
import { getContentByIdService } from "../content/service";

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
 * Generate quiz with AI by content ID
 */
export const generateQuizByContentIdService = async (
  contentId: string,
  difficulty: QuizDifficulty
): Promise<IQuiz> => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new ApiError(404, "Content not found");
  }

  let quizDifficulty = difficulty;

  // validate difficulty
  if (!Object.values(QuizDifficulty).includes(difficulty)) {
    quizDifficulty = QuizDifficulty.MEDIUM;
  }

  const quizData = await AIGenerator.generateQuizQuestions(contentId, getContentByIdService, {
    timeLimit: 300,
    maxAttempts: 3,
    difficulty: quizDifficulty,
  });

  const quiz = await Quiz.create(quizData);

  return quiz;
};

/**
 * Get all quizzes
 */
export const getAllQuizzesService = async (query: any = {}): Promise<any> => {
  const apiFeatures = new ApiFeatures(Quiz.find().populate("content"), query)
    .filteration()
    .sort()
    .search()
    .fields()
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
    endDate: { $gte: now },
  }).populate("content");
};

/**
 * Update quiz status
 */
export const updateQuizStatusService = async (quizId: string, status: string): Promise<IQuiz> => {
  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new ApiError(404, "Quiz not found");
  }

  quiz.status = status as QuizStatus;
  await quiz.save();

  return quiz;
};
