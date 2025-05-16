import mongoose from "mongoose";
import { IContent, ContentType, ContentStatus } from "./type";

// Content Schema
const contentSchema = new mongoose.Schema<IContent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    type: { type: String, enum: ContentType, required: true },
    status: { type: String, enum: ContentStatus, default: ContentStatus.ACTIVE },
    category: { type: String, required: true },
    estimatedReadTime: { type: Number, required: true },
    points: { type: Number, required: true },
    isSponsored: { type: Boolean, default: false },
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: "Sponsor" },
    tags: { type: [String], required: true },
    blockchainHash: { type: String },
    trustRating: { type: Number, default: 0 },
    trustRatingCount: { type: Number, default: 0 },
    audioUrl: { type: String },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export models
export const Content = mongoose.model<IContent>("Content", contentSchema);
