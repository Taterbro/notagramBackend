import { Request, Response, NextFunction } from "express";
import { isTokenValid } from "@/models/tokenModel.js";

export const tokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      next("Access denied. No Bearer token found");
      return;
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("no token from auth headers.");
    }
    const valid = await isTokenValid(token);
    if (valid.valid) {
      next();
    } else {
      res.status(401).json({ error: valid.message });
    }
  } catch (err) {
    console.log("error from middleware (tokenValidator)\n", err);
    next("Token validation failed");
  }
};
