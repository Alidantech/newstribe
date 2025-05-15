import { Document } from "mongoose";

export enum RewardType {
  POINTS = "points",
  AIRTIME = "airtime",
  VOUCHER = "voucher",
  HAMPER = "hamper",
}

export interface IReward extends Document {
  name: string;
  description: string;
  type: RewardType;
  pointsRequired: number;
  quantity: number;
  image: string;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
