import { IUser } from "../type";

export enum PointsSource {
  CONTENT_READ = "content_read",
  QUIZ_COMPLETION = "quiz_completion",
  GAME_PLAY = "game_play",
  BADGE_EARN = "badge_earn",
  COMMENT = "comment",
  LIKE = "like",
  SHARE = "share",
  RATE = "rate",
}


export interface IUserPoints extends Document {
  user: IUser;
  pointsEarned: number;
  source: PointsSource;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
