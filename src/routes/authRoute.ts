import express from "express";
import {
  registerUser,
  sendVerificationCode,
} from "@/controllers/authController.js";

export const auth = express.Router();

auth.post("/register", registerUser);
auth.get("/get-otp/:email", sendVerificationCode);
