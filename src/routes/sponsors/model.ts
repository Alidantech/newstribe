import mongoose from "mongoose";
import { ISponsor } from "./type";

const sponsorSchema = new mongoose.Schema(
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
    logo: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    contactPhone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

// Create indexes
sponsorSchema.index({ name: 1 });
sponsorSchema.index({ isActive: 1 });
sponsorSchema.index({ contactEmail: 1 });

export const Sponsor = mongoose.model<ISponsor>("Sponsor", sponsorSchema); 