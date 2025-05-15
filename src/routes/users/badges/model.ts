import mongoose from "mongoose";
import { IUserBadge } from "./type";

const userBadgeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    badge: { type: mongoose.Schema.Types.ObjectId, ref: "Badge", required: true },
    earnedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });
userBadgeSchema.index({ earnedAt: -1 });

export const UserBadge = mongoose.model<IUserBadge>("UserBadge", userBadgeSchema); 