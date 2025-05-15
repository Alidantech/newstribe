import { Document } from "mongoose";
import { IUser } from "../type";

export enum ContentCategory {
  NEWS = "news",
  SPORTS = "sports",
  ENTERTAINMENT = "entertainment",
  TECHNOLOGY = "technology",
  BUSINESS = "business",
  LIFESTYLE = "lifestyle",
  HEALTH = "health",
  EDUCATION = "education"
}

export enum ContentFormat {
  ARTICLE = "article",
  VIDEO = "video",
  AUDIO = "audio",
  IMAGE = "image",
  QUIZ = "quiz"
}

export enum ReadingLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced"
}

export enum NotificationPreference {
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms",
  NONE = "none"
}

export interface IUserPreferences extends Document {
  user: IUser;
  categories: ContentCategory[];
  preferredFormats: ContentFormat[];
  readingLevel: ReadingLevel;
  notificationPreferences: NotificationPreference[];
  dailyDigest: boolean;
  weeklyDigest: boolean;
  language: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

