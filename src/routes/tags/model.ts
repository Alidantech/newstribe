import mongoose from "mongoose";
import { ITag } from "./type";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    usageCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Create indexes
tagSchema.index({ name: 1 });
tagSchema.index({ isActive: 1 });
tagSchema.index({ usageCount: -1 });

export const Tag = mongoose.model<ITag>("Tag", tagSchema); 