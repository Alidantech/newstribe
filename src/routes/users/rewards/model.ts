import mongoose from "mongoose";
import { IUserReward } from "./type";

const userRewardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: "Reward", required: true },
    redeemedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ["pending", "redeemed", "expired", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Create indexes
userRewardSchema.index({ user: 1, reward: 1 });
userRewardSchema.index({ redeemedAt: -1 });
userRewardSchema.index({ status: 1 });

export const UserReward = mongoose.model<IUserReward>("UserReward", userRewardSchema); 