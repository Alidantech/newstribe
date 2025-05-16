import { Document } from "mongoose";
import { ISponsor } from "../sponsors/type";
import { IQuiz } from "../quizzes/type";

export enum ContentType {
  ARTICLE = "article",
  QUIZ = "quiz",
  SPONSORED = "sponsored",
  MINI_GAME = "mini_game",
  NEWS = "news",
  VIDEO = "video",
  AUDIO = "audio",
  IMAGE = "image",
  TEXT = "text",
  LINK = "link",
  DOCUMENT = "document",
  OTHER = "other",
}

export enum ContentLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export enum ContentStatus {
  ACTIVE = "active",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export interface IContent extends Document {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: ContentType;
  status: ContentStatus;
  category: string;
  estimatedReadTime: number;
  points: number;
  isSponsored: boolean;
  sponsor?: ISponsor;
  blockchainHash?: string;
  tags: string[];
  trustRating: number;
  trustRatingCount: number;
  audioUrl?: string;
  quiz?: IQuiz;
  content: string;
  level: ContentLevel;
  createdAt: Date;
  updatedAt: Date;
}
