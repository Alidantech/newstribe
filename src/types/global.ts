import Joi from "joi";
import { IUser } from "../routes/users/type";

export enum ENodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export enum EResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
  FAIL = "fail",
}

export interface IAppResponse {
  status: EResponseStatus;
  message: string;
  data?: any;
  errors?: any[] | null;
}

export interface UserRequest extends Request {
  path: any;
  baseUrl: any;
  user: IUser;
  body: any;
  params: any;
  query: any;
  cookies?: { token?: string };
}

// validate mongoose id schema using joi
export const idSchema = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
}).unknown(true);
