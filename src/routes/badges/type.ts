import { Document } from "mongoose";

export interface IBadge extends Document {
  name: string;
  description: string;
  image: string;
  pointsRequired: number;
  createdAt: Date;
  updatedAt: Date;
}
