import express from "express";
import { registerUser } from "@/controllers/authController.js";

export const auth = express.Router();

auth.post("/register", registerUser);
