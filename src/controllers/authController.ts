import { createUser, getUser } from "@/models/userModel.js";
import { Response, Request } from "express";
import {
  handleFormValidationError,
  createUserForm,
  otpForm,
} from "@/config/formValidation.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redisClient } from "@/config/caching.js";

export async function registerUser(req: Request, res: Response) {
  if (!req.body) {
    console.log("nothing fr");
    res
      .status(401)
      .json({ error: "you fucking dumbass, you didn't send anything" });
    return;
  }
  const newUser = req.body;

  try {
    createUserForm.parse(newUser, {
      reportInput: true,
    });
    //const salt = bcrypt.genSalt(10);
    const userFound = await getUser({ email: newUser.email });
    if (userFound) {
      return res.status(401).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const response = await createUser({ ...newUser, password: hashedPassword });

    return res.status(201).json({
      message: "User registered!",
      user: response,
    });
  } catch (error) {
    handleFormValidationError(error, res);
  }
}

export async function sendVerificationCode(req: Request, res: Response) {
  try {
    otpForm.parse(req.body);
    const userEmail = req.body.email;
    const userFound = await getUser({ email: userEmail });
    if (!userFound) {
      return res.status(401).json({ error: "Email address not found." });
    }
    const otpCode = crypto.randomBytes(32).toString("hex");
    const hashedEmail = await bcrypt.hash(userEmail, 10);
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    await redisClient.set(hashedEmail, hashedOtp);
  } catch (error) {
    console.log(error);
    handleFormValidationError(error, res);
  }
}
