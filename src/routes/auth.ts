import express from "express";
import { createUser } from "@/models/userModel.js";

const auth = express.Router();

auth.post("/register", createUser);
