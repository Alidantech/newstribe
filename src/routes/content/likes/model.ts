import mongoose from "mongoose";
import { ILike } from "./type";

const likeSchema = new mongoose.Schema(
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
likeSchema.index({ user: 1, content: 1 }, { unique: true });
// Create indexes for efficient querying
likeSchema.index({ user: 1 });
likeSchema.index({ content: 1 });
likeSchema.index({ createdAt: -1 });

export const Like = mongoose.model<ILike>("Like", likeSchema); 