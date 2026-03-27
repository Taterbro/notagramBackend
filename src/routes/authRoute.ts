import express from "express";
import {
  registerUser,
  sendEmailVerificationCode,
  verifyEmail,
  loginUser,
  logoutUser,
} from "@/controllers/authController.js";
import { formValidator } from "@/middleware/formValidation.js";
import {
  createUserForm,
  loginForm,
  verifyOtpForm,
} from "@/config/formValidation.js";
import { tokenValidator } from "@/middleware/tokenValidator.js";

export const auth = express.Router();

auth.post("/register", formValidator(createUserForm), registerUser);
auth.get("/get-otp/:email", sendEmailVerificationCode);
auth.post("/verify-email", formValidator(verifyOtpForm), verifyEmail);
auth.post("/login", formValidator(loginForm), loginUser);
auth.post("/logout", tokenValidator, logoutUser);
