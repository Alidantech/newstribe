import { Document } from "mongoose";
import { IContent } from "../content/type";

export interface IQuizQuestion extends Document {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuizSettings {
  timeLimit: number;
  maxAttempts: number;
  difficulty: "easy" | "medium" | "hard";
}

export interface IQuiz extends Document {
  content: IContent;
  questions: IQuizQuestion[];
  points: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "inactive" | "completed";
  settings: IQuizSettings;
  createdAt: Date;
  updatedAt: Date;
}
