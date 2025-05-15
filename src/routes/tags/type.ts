import { Document } from "mongoose";

export interface ITag extends Document {
  name: string;
  description: string;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

