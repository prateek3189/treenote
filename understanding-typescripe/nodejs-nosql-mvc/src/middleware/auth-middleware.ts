import { Request, Response, NextFunction } from "express";
import { IUser } from "../types";

export default function auth(req: Request, res: Response, next: NextFunction) {
  const user = (req.session as any).user as IUser | undefined;

  if (!user) {
    return next();
  }

  res.locals.isAdmin = user.user_type === "A";
  next();
}
