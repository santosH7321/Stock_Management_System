import { IUserPayload } from "../middlewares/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user: IUserPayload;
    }
  }
}

export {};