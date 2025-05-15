import { Document } from "mongoose";
import { IUser } from "../../users/type";
import { IBadge } from "../../badges/type";

export interface IUserBadge extends Document {
  user: IUser;
  badge: IBadge;
  earnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
