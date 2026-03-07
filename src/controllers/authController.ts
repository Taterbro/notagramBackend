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
import { generateEmailVerificationEmail, resend } from "@/config/emailApi.js";

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
      user: { ...response, password: undefined, createdAt: undefined },
    });
  } catch (error) {
    handleFormValidationError(error, res);
  }
}

export async function sendVerificationCode(req: Request, res: Response) {
  const tokenTTL = 600;
  try {
    if (!req.params.email) {
      return res.status(400).json({ error: "Please enter a valid email" });
    }
    const usersEmail = String(req.params.email);
    otpForm.parse(req.body);
    const userFound = await getUser({ email: usersEmail });
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

    const timerCheck = await redisClient.set(`${id}_queryAgainTimer`, "time", {
      expiration: { type: "EX", value: 60 },
      condition: "NX",
    });
    if (timerCheck === null) {
      return res
        .status(401)
        .json({ error: "Please wait a minute before sending requests" });
    }
    await redisClient.set(id, hashedOtp, {
      expiration: { type: "EX", value: tokenTTL },
    });
    const verificationCode = await redisClient.get(id);
    if (verificationCode === null) {
      throw new Error(
        "could not retrieve code for some reason. \nerrorfn: sendVerificationCode"
      );
    }
    const { data, error } = await resend.emails.send({
      from: "Vic <onboarding@resend.dev>",
      to: [usersEmail],
      subject: "Notagram Email Verification",
      html: generateEmailVerificationEmail(otpCode, String(tokenTTL / 60)),
    });
    res.status(200).json({
      message: `The code has been sent to your email and will expire in ${
        tokenTTL / 60
      } minutes.`,
    });
  } catch (error) {
    console.log(error);
    handleFormValidationError(error, res);
  }
}
