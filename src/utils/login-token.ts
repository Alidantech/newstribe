import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const generateTokenAndSetCookies = (
  userId: Types.ObjectId,
  res: Response<any, Record<string, any>>
) => {

  const token = jwt.sign({ userId }, process.env.JWT_SECRET || "", {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  });
};

export default generateTokenAndSetCookies;
