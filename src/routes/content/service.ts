import { Content } from "./model";
import { ApiError } from "../../utils/api.errors";
import { ApiFeatures } from "../../utils/api.features";
import { ContentLevel, ContentType, IContent } from "./type";
import { createContentTagService } from "./tags/service";
import { AIGenerator } from "../../utils/ai";
import { QuizDifficulty } from "../quizzes/type";
import { createQuizService } from "../quizzes/service";

// get quiz difficulty based on content level
const getQuizDifficulty = (level: ContentLevel) => {
  switch (level) {
    case ContentLevel.BEGINNER:
      return QuizDifficulty.EASY;
    case ContentLevel.INTERMEDIATE:
      return QuizDifficulty.MEDIUM;
    case ContentLevel.ADVANCED:
      return QuizDifficulty.HARD;
    default:
      return QuizDifficulty.MEDIUM;
  }
};

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

export const generateContentService = async (contentData: {
  prompt: string;
  options: Partial<IContent>;
}): Promise<IContent> => {
  const prompt = contentData.prompt || "";
  const options = contentData.options || {};

  console.log("generating content");

  // generate content
  const content = await AIGenerator.generateContent(prompt, {
    type: options.type || ContentType.ARTICLE,
    category: options.category || "",
    points: options.points || 0,
    isSponsored: options.isSponsored || false,
    tags: options.tags || [],
    estimatedReadTime: options.estimatedReadTime || 0,
    sponsor: options.sponsor as string | undefined,
    level: options.level || ContentLevel.BEGINNER,
  });

  console.log("content generated");

  // create content
  const newContent = await createContentService({
    ...content,
    imageUrl: options.imageUrl || "",
  });

  // if type is quiz, generate quiz
  if (options.type === ContentType.QUIZ) {
    console.log("generating quiz");
    const quiz = await AIGenerator.generateQuizQuestions(
      newContent._id.toString(),
      getContentByIdService,
      {
        timeLimit: 300,
        maxAttempts: 3,
        difficulty: getQuizDifficulty(options.level as ContentLevel),
      }
    );
    const createdQuiz = await createQuizService(quiz);
    newContent.quiz = createdQuiz._id as any;
    await newContent.save();
  }

  console.log("content generated");

  return newContent;
};

export const getContentByIdService = async (id: string): Promise<IContent> => {
  const content = await Content.findById(id).populate("sponsor quiz");
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
  const apiFeatures = new ApiFeatures(Content.find().populate("sponsor quiz").lean(), query)
    .search()
    .filteration()
    .sort()
    .fields()
    .pagination();

  const contents = await apiFeatures.getPaginatedData<IContent>("contents");
  return contents;
};
