import { Document } from "mongoose";
import { IContent } from "../content/type";

export interface IQuizQuestion extends Document {
  question: string;
  options: string[];
  correctIndex: number;
}

export enum QuizDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface IQuizSettings {
  timeLimit: number;
  maxAttempts: number;
  difficulty: QuizDifficulty;
}

export enum QuizStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  COMPLETED = "completed",
}

export interface IQuiz extends Document {
  content: IContent;
  questions: IQuizQuestion[];
  points: number;
  startDate: Date;
  endDate: Date;
  status: QuizStatus;
  settings: IQuizSettings;
  createdAt: Date;
  updatedAt: Date;
}
