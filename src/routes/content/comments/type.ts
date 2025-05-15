import { Document } from "mongoose";
import { IUser } from "../../users/type";
import { IContent } from "../type";

export interface IComment extends Document {
  user: IUser;
  content: IContent;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
