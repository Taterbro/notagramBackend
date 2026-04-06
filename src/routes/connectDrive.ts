import express from "express";
import {
  connectDriveAccount,
  getTokens,
} from "@/controllers/driveController.js";
import { tokenValidator } from "@/middleware/tokenValidator.js";

export const connectDrive = express.Router();

connectDrive.post("/:userId", tokenValidator, connectDriveAccount);
connectDrive.get("/token", getTokens);
