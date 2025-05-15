import { Document } from "mongoose";

export interface ISponsor extends Document {
  name: string;
  description: string;
  logo: string;
  website: string;
  isActive: boolean;
  contactEmail: string;
  contactPhone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}
