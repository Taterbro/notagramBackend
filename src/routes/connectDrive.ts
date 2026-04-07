import express from "express";
import {
  connectDriveAccount,
  getAuthTokens,
  getTokens,
} from "@/controllers/driveController.js";
import { tokenValidator } from "@/middleware/tokenValidator.js";

export const connectDrive = express.Router();

connectDrive.post("/base/:userId", tokenValidator, connectDriveAccount);
connectDrive.get("/auth-tokens", getAuthTokens);
connectDrive.get("/get-tokens", getTokens);
