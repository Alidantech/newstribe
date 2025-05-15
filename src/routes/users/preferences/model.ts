import mongoose from "mongoose";
import {
  IUserPreferences,
  ContentCategory,
  ContentFormat,
  ReadingLevel,
  NotificationPreference,
} from "./type";

const userPreferencesSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    categories: [{ type: String, enum: Object.values(ContentCategory), required: true }],
    preferredFormats: [{ type: String, enum: Object.values(ContentFormat), required: true }],
    readingLevel: { type: String, enum: Object.values(ReadingLevel), required: true },
    notificationPreferences: [
      { type: String, enum: Object.values(NotificationPreference), required: true },
    ],
    dailyDigest: { type: Boolean, default: false },
    weeklyDigest: { type: Boolean, default: false },
    language: { type: String, required: true },
    timezone: { type: String, required: true },
  },
  { timestamps: true }
);

// Create indexes
userPreferencesSchema.index({ user: 1 }, { unique: true });
userPreferencesSchema.index({ categories: 1 });
userPreferencesSchema.index({ readingLevel: 1 });

export const UserPreferences = mongoose.model<IUserPreferences>(
  "UserPreferences",
  userPreferencesSchema
);
