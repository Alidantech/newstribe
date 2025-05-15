import mongoose from "mongoose";
import { IUserGame } from "./type";

const userGameSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
    pointsEarned: { type: Number, required: true },
    playedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes
userGameSchema.index({ user: 1, game: 1 });
userGameSchema.index({ playedAt: -1 });
userGameSchema.index({ pointsEarned: -1 });

export const UserGame = mongoose.model<IUserGame>("UserGame", userGameSchema); 