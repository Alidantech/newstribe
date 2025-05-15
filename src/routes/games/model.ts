import mongoose from "mongoose";
import { IGame, GameType } from "./type";

const gameSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      enum: Object.values(GameType),
      required: true 
    },
    content: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Content", 
      required: true 
    },
    points: { 
      type: Number, 
      required: true 
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["active", "inactive", "completed"],
      default: "active"
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { timestamps: true }
);

// Create indexes
gameSchema.index({ type: 1 });
gameSchema.index({ content: 1 });
gameSchema.index({ status: 1 });
gameSchema.index({ startDate: 1, endDate: 1 });

export const Game = mongoose.model<IGame>("Game", gameSchema); 