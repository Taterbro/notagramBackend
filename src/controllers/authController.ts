import { createUser, getUser, verifyUser } from "@/models/userModel.js";
import { Response, Request } from "express";
import {
  handleFormValidationError,
  createUserForm,
  otpForm,
  loginForm,
  verifyOtpForm,
} from "@/config/formValidation.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { redisClient } from "@/config/caching.js";
import { generateEmailVerificationEmail, resend } from "@/config/emailApi.js";
import { createToken, deleteToken, getToken } from "@/models/tokenModel.js";

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
    const response = await createUser({
      ...newUser,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered!",
      user: { ...response, password: undefined, createdAt: undefined },
    });
  } catch (error) {
    handleFormValidationError(error, res);
  }
}

export async function sendEmailVerificationCode(req: Request, res: Response) {
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
    const otpCode = crypto.randomInt(0, 999999).toString().padStart(6, "0");
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
    console.log("user's email: ", usersEmail);
    const { error } = await resend.emails.send({
      from: "Vic <onboarding@resend.dev>",
      to: [usersEmail],
      subject: "Notagram Email Verification",
      html: generateEmailVerificationEmail(otpCode, String(tokenTTL / 60)),
    });
    if (error) {
      throw new Error(`code: ${error.statusCode}\nmessage: ${error.message}`);
    }
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

export async function verifyEmail(req: Request, res: Response) {
  console.log("we running");
  verifyOtpForm.parse(req.body);
  const reqBody = req.body;
  try {
    const otpExists = await redisClient.get(String(reqBody.userId));
    if (!otpExists) {
      return res
        .status(404)
        .json({ error: "No OTP code found, please request for a new OTP." });
    }
    const valid = await bcrypt.compare(reqBody.code, otpExists);
    if (!valid) {
      return res.status(422).json({ error: "OTP code is invalid. Womp Womp" });
    }
    await verifyUser(reqBody.userId);
    return res.status(200).json({ message: "Verified! \nWelcome to the CULt" });
  } catch (error) {
    console.log(error);
    handleFormValidationError(error, res);
  }
}

export async function loginUser(req: Request, res: Response) {
  if (!req.body) {
    res
      .status(401)
      .json({ error: "you fucking dumbass, you didn't send anything" });
    return;
  }
  const userBody = req.body;

  try {
    loginForm.parse(userBody, {
      reportInput: true,
    });
    const userFound = await getUser({ email: userBody.email });
    if (!userFound) {
      return res
        .status(401)
        .json({ error: "Email does not exist. Please create an account" });
    }
    const valid = await bcrypt.compare(userBody.password, userFound.password);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password. Womp Womp" });
    }
    const alreadyLoggedIn = await getToken({ userId: userFound.id });
    alreadyLoggedIn && deleteToken({ userId: userFound.id });

    const randomString = crypto.randomBytes(40).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(randomString)
      .digest("hex");

    const response = await createToken({
      tokenHash: tokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now()),
      deviceId: userBody.deviceId,
      userId: userFound.id,
    });

    return res.status(200).json({
      message: "JACK IN!!!",
      user: { ...userFound, password: undefined },
      authToken: `${response?.id}|${randomString}`,
    });
  } catch (error) {
    handleFormValidationError(error, res);
  }
}

export async function testToken(req: Request, res: Response) {
  if (!req.body) {
    res
      .status(401)
      .json({ error: "you fucking dumbass, you didn't send anything" });
    return;
  }
  getToken({ tokenId: req.body.id });
}
