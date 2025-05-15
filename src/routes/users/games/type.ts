import { IUser } from "../type";
import { IGame } from "../../games/type";

export interface IUserGame extends Document {
  user: IUser;
  game: IGame;
  pointsEarned: number;
  playedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
