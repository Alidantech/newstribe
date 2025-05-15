import { IUser } from "../users/type";
import { IUserContext, IQuestion, USSD_MESSAGES, USSD_CONTEXTS } from "./types";
import * as userService from "../users/service";
import * as redeemService from "../users/redeem/service";

// Sample questions - In a real app, these would come from a database
const QUESTIONS: IQuestion[] = [
  {
    question: "What is the capital of Kenya?",
    answer: "Nairobi",
    points: 10,
  },
  {
    question: "Which year did Kenya gain independence?",
    answer: "1963",
    points: 15,
  },
  {
    question: "What is the largest lake in Kenya?",
    answer: "Lake Victoria",
    points: 20,
  },
];

class UserInputHandler implements IUserContext {
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

  constructor() {
    this.userContext = USSD_CONTEXTS.WELCOME;
    this.additionalData = null;
    this.phoneNumber = null;
    this.registered = false;
    this.user = null;
    this.userId = null;
    this.requestIndex = 0;
    this.points = 0;
    this.currentQuestion = null;
  }

  // Function to extract the latest text from USSD request
  extractLatestText(ussdRequest: string[]): string {
    if (!ussdRequest || ussdRequest.length === 0) {
      return "";
    }
    return ussdRequest[ussdRequest.length - 1];
  }

  async handleInput(text: string[]): Promise<string> {
    console.log("Session started at:", new Date().toLocaleString());
    const latestText = this.extractLatestText(text);
    console.log("User response:", latestText);

    try {
      this.requestIndex += 1;

      // Check if user is registered
      if (this.phoneNumber) {
        const user = await userService.getUserByPhoneNumberService(this.phoneNumber);
        this.setUserInfo({
          registered: true,
          userData: user,
          userId: user._id.toString(),
        });
      }

      switch (this.userContext) {
        case USSD_CONTEXTS.WELCOME:
          return this.welcomeMenu(latestText);
        case USSD_CONTEXTS.AUTHENTICATE:
          return this.authenticateMenu(latestText);
        case USSD_CONTEXTS.ANSWER_QUESTION:
          return this.answerQuestionMenu(latestText);
        case USSD_CONTEXTS.SHOW_POINTS:
          return this.showPointsMenu(latestText);
        case USSD_CONTEXTS.REDEEM_MENU:
          return this.redeemMenu(latestText);
        case USSD_CONTEXTS.REDEEM_AIRTIME:
          return this.redeemAirtimeMenu(latestText);
        default:
          return `END ${USSD_MESSAGES.ERROR}`;
      }
    } catch (error) {
      console.error("Error handling user input:", error);
      this.clearContext();
      this.clearUserInfo();
      return `END ${USSD_MESSAGES.ERROR}`;
    }
  }

  welcomeMenu(text: string): string {
    if (!this.registered) {
      return `CON ${USSD_MESSAGES.WELCOME}\n\nPlease enter your email to authenticate:`;
    }

    this.setUserContext(USSD_CONTEXTS.AUTHENTICATE);
    return `CON Welcome back!\n\nPlease enter your password to continue:`;
  }

  authenticateMenu(text: string): Promise<string> {
    if (!this.user) {
      return Promise.resolve(`END ${USSD_MESSAGES.ERROR}`);
    }

    return this.user.comparePassword(text).then((isValid) => {
      if (isValid) {
        this.setUserContext(USSD_CONTEXTS.ANSWER_QUESTION);
        const question = this.getRandomQuestion();
        this.currentQuestion = question;
        return `CON ${question.question}`;
      }
      return `END ${USSD_MESSAGES.AUTH_FAILED}`;
    });
  }

  answerQuestionMenu(text: string): string {
    if (!this.currentQuestion) {
      return `END ${USSD_MESSAGES.NO_QUESTIONS}`;
    }

    const isCorrect = text.toLowerCase() === this.currentQuestion.answer.toLowerCase();
    if (isCorrect) {
      this.points += this.currentQuestion.points;
      this.setUserContext(USSD_CONTEXTS.SHOW_POINTS);
      return `CON Correct answer! You earned ${this.currentQuestion.points} points.`;
    }

    return `END Wrong answer. The correct answer was: ${this.currentQuestion.answer}`;
  }

  showPointsMenu(text: string): string {
    this.setUserContext(USSD_CONTEXTS.REDEEM_MENU);
    return `CON ${USSD_MESSAGES.REDEEM_WELCOME}`;
  }

  redeemMenu(text: string): string {
    switch (text) {
      case "1":
        this.setUserContext(USSD_CONTEXTS.REDEEM_AIRTIME);
        return `CON ${USSD_MESSAGES.ENTER_AMOUNT}`;
      case "2":
        return `END Your current balance is ${this.points} points (${redeemService.pointsToKes(this.points)} KES)`;
      case "3":
        return `END ${USSD_MESSAGES.THANK_YOU}`;
      default:
        return `CON ${USSD_MESSAGES.INVALID_INPUT}\n\n${USSD_MESSAGES.REDEEM_WELCOME}`;
    }
  }

  redeemAirtimeMenu(text: string): string {
    const amount = parseInt(text);
    if (isNaN(amount) || amount <= 0) {
      return `CON ${USSD_MESSAGES.INVALID_INPUT}\n\n${USSD_MESSAGES.ENTER_AMOUNT}`;
    }

    const requiredPoints = redeemService.kesToPoints(amount);
    if (this.points < requiredPoints) {
      return `END ${USSD_MESSAGES.INSUFFICIENT_POINTS.replace(
        "{points}",
        requiredPoints.toString()
      ).replace("{amount}", amount.toString())}`;
    }

    // Send airtime
    redeemService
      .sendAirtime(this.phoneNumber || "", amount)
      .then(() => {
        this.points -= requiredPoints;
        return `END ${USSD_MESSAGES.REDEEM_SUCCESS.replace("{amount}", amount.toString()).replace(
          "{phoneNumber}",
          this.phoneNumber || ""
        )}`;
      })
      .catch(() => {
        return `END ${USSD_MESSAGES.REDEEM_FAILED}`;
      });

    return `CON Processing your request...`;
  }

  getRandomQuestion(): IQuestion {
    const randomIndex = Math.floor(Math.random() * QUESTIONS.length);
    return QUESTIONS[randomIndex];
  }

  setUserContext(context: string, additionalData?: any): void {
    this.userContext = context;
    if (additionalData) {
      this.additionalData = additionalData;
    }
  }

  setPhoneNumber(number: string): void {
    this.phoneNumber = number;
  }

  getPhoneNumber(): string | null {
    return this.phoneNumber;
  }

  setUserInfo(userInfo: {
    registered: boolean;
    userData: IUser | null;
    userId: string | null;
  }): void {
    this.registered = userInfo.registered;
    this.user = userInfo.userData;
    this.userId = userInfo.userId;
  }

  clearContext(): void {
    this.userContext = USSD_CONTEXTS.WELCOME;
    this.currentQuestion = null;
  }

  clearUserInfo(): void {
    this.registered = false;
    this.user = null;
    this.userId = null;
    this.points = 0;
  }
}

export default UserInputHandler;
