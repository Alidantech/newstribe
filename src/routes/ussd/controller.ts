import { Request, Response } from "express";
import UserInputHandler from "./service";

const userInputHandler = new UserInputHandler();

export const ussdRequest = async (req: Request, res: Response): Promise<void> => {
  const { phoneNumber, text } = req.body;
  
  if (!phoneNumber) {
    res.status(400).send("Phone number is required");
    return;
  }

  userInputHandler.setPhoneNumber(phoneNumber);
  const response = await userInputHandler.handleInput(text ? text.split("*") : []);
  res.send(response);
};

export default userInputHandler;