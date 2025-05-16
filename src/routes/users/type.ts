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
  firstName: string;
  lastName: string;
  email: string;
  status: UserStatus;
  isEmailVerified: boolean;
  roles: UserRoles[];
  points: number;
  phone?: string;
  avatar?: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
