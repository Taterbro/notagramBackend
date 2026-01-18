import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      error: "Invalid Syntax",
      message: "Please check your request body",
    });
    return;
  } else {
    res.status(500).json({ error: "Something went wrong on our end" });
    return;
  }
};
