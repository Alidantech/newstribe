import { Document } from "mongoose";
import { IContent } from "../type";
import { ITag } from "../../tags/type";

export interface IContentTag extends Document {
  content: IContent;
  tag: ITag;
}
