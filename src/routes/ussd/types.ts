import { IUser } from "../users/type";

export interface IUserContext {
  userContext: string;
  additionalData: any;
  phoneNumber: string | null;
  registered: boolean;
  user: IUser | null;
  userId: string | null;
  requestIndex: number;
  points: number;
  currentQuestion: {
    points: number;
    question: string;
    answer: string;
  } | null;
}

export interface IQuestion {
  question: string;
  answer: string;
  points: number;
}

export interface IAirtimeRecipient {
  phoneNumber: string;
  amount: number;
  currencyCode: string;
}

export interface IAirtimeOptions {
  recipients: IAirtimeRecipient[];
}

export const USSD_MESSAGES = {
  WELCOME: "Welcome to NewsTribe USSD Service",
  INVALID_INPUT: "Invalid input. Please try again.",
  AUTH_SUCCESS: "Authentication successful! You have earned {points} points.",
  AUTH_FAILED: "Authentication failed. Please try again.",
  NO_QUESTIONS: "No questions available at the moment.",
  THANK_YOU: "Thank you for using NewsTribe USSD Service.",
  ERROR: "An error occurred. Please try again later.",
  REDEEM_WELCOME: "Welcome to Points Redemption\n\n1. Redeem Airtime\n2. Check Balance\n3. Exit",
  ENTER_AMOUNT: "Enter amount to redeem (in KES):",
  INSUFFICIENT_POINTS: "Insufficient points. You need {points} points for {amount} KES.",
  REDEEM_SUCCESS: "Successfully redeemed {amount} KES airtime to {phoneNumber}",
  REDEEM_FAILED: "Failed to redeem airtime. Please try again later."
} as const;

export const USSD_CONTEXTS = {
  WELCOME: "welcome",
  AUTHENTICATE: "authenticate",
  ANSWER_QUESTION: "answer_question",
  SHOW_POINTS: "show_points",
  REDEEM_MENU: "redeem_menu",
  REDEEM_AIRTIME: "redeem_airtime"
} as const;

export const POINTS_TO_KES_RATIO = 10; // 10 points = 1 KES 