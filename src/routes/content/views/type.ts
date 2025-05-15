import { Document } from "mongoose";
import { IUser } from "../../users/type";
import { IContent } from "../type";

export interface IView extends Document {
  user: IUser;
  content: IContent;
  createdAt: Date;
  updatedAt: Date;
} 