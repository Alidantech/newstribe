import mongoose from "mongoose";
import { IContentTag } from "./type";

const contentTagSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true
    },
    tag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true
    }
  },
  { timestamps: true }
);

// Create compound index for unique content-tag combination
contentTagSchema.index({ content: 1, tag: 1 }, { unique: true });
// Create indexes for efficient querying
contentTagSchema.index({ content: 1 });
contentTagSchema.index({ tag: 1 });
contentTagSchema.index({ createdAt: -1 });

export const ContentTag = mongoose.model<IContentTag>("ContentTag", contentTagSchema); 