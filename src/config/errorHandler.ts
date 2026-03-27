import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("le: ", err);
  res.status(500).json({ error: "Something went wrong on our end" });
  return;
};
