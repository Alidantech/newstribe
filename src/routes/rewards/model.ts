import mongoose from "mongoose";
import { IReward, RewardType } from "./type";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(RewardType),
      required: true
    },
    pointsRequired: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true
    },
    expiryDate: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Create indexes
rewardSchema.index({ name: 1 });
rewardSchema.index({ type: 1 });
rewardSchema.index({ pointsRequired: 1 });
rewardSchema.index({ isActive: 1 });
rewardSchema.index({ expiryDate: 1 });

export const Reward = mongoose.model<IReward>("Reward", rewardSchema); 