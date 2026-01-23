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
    if (!req.params.email) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    otpForm.parse(req.body);
    const userFound = await getUser({ email: String(req.params.email) });
    if (!userFound) {
      return res.status(401).json({ error: "Email address not found." });
    }
    if (userFound.isVerified) {
      return res
        .status(401)
        .json({ error: "You're already verified, you greedy fuck!" });
    }
    const id = String(userFound.id);
    const otpCode = crypto.randomBytes(32).toString("hex");
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    const existingCode = await redisClient.get(id);
    if (existingCode) {
      return res
        .status(401)
        .json({
          error: "Please wait ten minutes before making another request",
        });
    }
    await redisClient.set(id, hashedOtp, {
      expiration: { type: "EX", value: 600 },
    });
    const verificationCode = await redisClient.get(id);
    res.status(200).json({
      code: verificationCode,
      message:
        "this is for testing, future vic. Please just send a success message and send the code to their email, NOT in the response",
    });
  } catch (error) {
    console.log(error);
    handleFormValidationError(error, res);
  }
}
