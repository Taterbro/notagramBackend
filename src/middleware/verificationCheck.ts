import { Request, Response, NextFunction } from "express";
import { getUserFromToken } from "@/utils/getUserFromToken.js";

export const verificationCheck = async (
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
    const user = await getUserFromToken(token);

    if (!user) {
      return res
        .status(400)
        .json({ error: "The access token might be invalid" });
    }
    if (user.isVerified) {
      next();
    } else {
      return res.status(401).send({
        error: "User not verified. Please verify your email address.",
      });
    }
  } catch (err) {
    console.log("error from middleware (verificationCheck)\n", err);
    next("User verification check failed");
  }
};
