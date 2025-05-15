import mongoose from "mongoose";
import { IUserPoints, PointsSource } from "./type";

const userPointsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pointsEarned: { type: Number, required: true },
    source: { type: String, enum: Object.values(PointsSource), required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes
userPointsSchema.index({ user: 1, date: -1 });
userPointsSchema.index({ source: 1 });

export const UserPoints = mongoose.model<IUserPoints>("UserPoints", userPointsSchema); 