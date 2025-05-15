import mongoose from "mongoose";
import { IUserProgress } from "./type";

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
    progress: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    quizScore: { type: Number },
    lastEngagedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes
userProgressSchema.index({ user: 1, content: 1 }, { unique: true });
userProgressSchema.index({ lastEngagedAt: -1 });

export const UserProgress = mongoose.model<IUserProgress>("UserProgress", userProgressSchema); 