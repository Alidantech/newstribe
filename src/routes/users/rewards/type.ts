import { IReward } from "../../rewards/type";
import { IUser } from "../type";

export interface IUserReward extends Document {
  user: IUser;
  reward: IReward;
  redeemedAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
