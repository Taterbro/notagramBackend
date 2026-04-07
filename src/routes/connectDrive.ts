import express from "express";
import {
  connectDriveAccount,
  getTokens,
  testing,
} from "@/controllers/driveController.js";
import { tokenValidator } from "@/middleware/tokenValidator.js";

export const connectDrive = express.Router();

connectDrive.post("/base/:userId", tokenValidator, connectDriveAccount);
connectDrive.get("/token", getTokens);
connectDrive.get("/test", testing);
