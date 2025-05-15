import { Document } from "mongoose";
import { IContent } from "../content/type";

export enum GameType {
  SCRATCH_CARD = "scratch_card",
  SPIN_WHEEL = "spin_wheel",
  QUIZ_DUEL = "quiz_duel",
}

export interface IGame extends Document {
  type: GameType;
  content: IContent;
  points: number;
  startDate: Date;
  endDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
