import { Document } from "mongoose";
import { IUser } from "../../users/type";
import { IContent } from "../type";

export interface IShare extends Document {
  user: IUser;
  content: IContent;
  createdAt: Date;
  updatedAt: Date;
}





