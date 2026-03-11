import express from "express";
import {
  registerUser,
  sendEmailVerificationCode,
  verifyEmail,
  loginUser,
  testToken,
} from "@/controllers/authController.js";

export const auth = express.Router();

auth.post("/register", registerUser);
auth.get("/get-otp/:email", sendEmailVerificationCode);
auth.post("/verify-email", verifyEmail);
auth.post("/login", loginUser);
auth.post("/testtoken", testToken);
