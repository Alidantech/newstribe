import { Document } from "mongoose";

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}

export enum UserRoles {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  USER = "user",
  CUSTOMER = "customer"
}

export interface IUser extends Document {
  points: number;
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  isEmailVerified: boolean;
  roles: UserRoles[];
  phone?: string;
  avatar?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
