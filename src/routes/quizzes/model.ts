import mongoose from "mongoose";
import { IQuiz, QuizDifficulty, QuizStatus } from "./type";

const quizQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctIndex: {
    type: Number,
    required: true,
  },
}, { _id: false });

const quizSchema = new mongoose.Schema(
  {
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
      required: true,
    },
    questions: [quizQuestionSchema],
    points: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(QuizStatus),
      default: QuizStatus.ACTIVE,
    },
    settings: {
      timeLimit: {
        type: Number,
        required: true,
      },
      maxAttempts: {
        type: Number,
        required: true,
      },
      difficulty: {
        type: String,
        enum: Object.values(QuizDifficulty),
        required: true,
      },
    },
  },
  { timestamps: true }
);

// Create indexes
quizSchema.index({ content: 1 });
quizSchema.index({ status: 1 });
quizSchema.index({ startDate: 1, endDate: 1 });

export const Quiz = mongoose.model<IQuiz>("Quiz", quizSchema);
