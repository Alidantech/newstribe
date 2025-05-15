import mongoose from "mongoose";
import { IShare } from "./type";

const shareSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true
    }
  },
  { timestamps: true }
);

// Create compound index for unique user-content combination
shareSchema.index({ user: 1, content: 1 }, { unique: true });
// Create indexes for efficient querying
shareSchema.index({ user: 1 });
shareSchema.index({ content: 1 });
shareSchema.index({ createdAt: -1 });

export const Share = mongoose.model<IShare>("Share", shareSchema); 