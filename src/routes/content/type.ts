import { Document } from "mongoose";
import { ISponsor } from "../sponsors/type";

export enum ContentType {
  ARTICLE = "article",
  QUIZ = "quiz",
  SPONSORED = "sponsored",
  MINI_GAME = "mini_game",
}

export enum ContentStatus {
  ACTIVE = "active",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export interface IContent extends Document {
  title: string;
  description: string;
  type: ContentType;
  status: ContentStatus;
  category: string;
  estimatedReadTime: number;
  points: number;
  isSponsored: boolean;
  sponsor?: ISponsor;
  blockchainHash?: string;
  trustRating: number;
  trustRatingCount: number;
  audioUrl?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
