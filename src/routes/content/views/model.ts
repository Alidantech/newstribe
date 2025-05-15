import mongoose from "mongoose";
import { IView } from "./type";

const viewSchema = new mongoose.Schema(
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
viewSchema.index({ user: 1, content: 1 }, { unique: true });
// Create indexes for efficient querying
viewSchema.index({ user: 1 });
viewSchema.index({ content: 1 });
viewSchema.index({ createdAt: -1 });

export const View = mongoose.model<IView>("View", viewSchema); 