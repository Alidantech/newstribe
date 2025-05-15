import mongoose from "mongoose";
import { IBadge } from "./type";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    pointsRequired: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    criteria: {
      type: {
        type: String,
        enum: ["points", "content_completed", "quiz_score", "game_plays"],
        required: true
      },
      value: { type: Number, required: true }
    }
  },
  { timestamps: true }
);

// Create indexes
badgeSchema.index({ name: 1 });
badgeSchema.index({ pointsRequired: 1 });
badgeSchema.index({ isActive: 1 });

export const Badge = mongoose.model<IBadge>("Badge", badgeSchema); 