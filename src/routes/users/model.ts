import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { IUser, UserStatus, UserRoles } from "./type";

// Main User schema definition
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: "" },
    lastName: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, unique: true, required: true },
    password: { type: String, required: false, select: false },
    status: { type: String, enum: UserStatus, default: UserStatus.ACTIVE },
    phone: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    roles: { type: [String], enum: UserRoles, default: [UserRoles.USER] },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// index for search
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ organisation: 1 });

// Create and export the User model
const User = mongoose.model<IUser>("User", userSchema) as mongoose.Model<IUser>;

export default User;
