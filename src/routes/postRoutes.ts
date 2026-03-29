import { createPost } from "@/controllers/postController.js";
import { tokenValidator } from "@/middleware/tokenValidator.js";
import { verificationCheck } from "@/middleware/verificationCheck.js";
import express from "express";

export const post = express.Router();

post.post("/add-post", tokenValidator, verificationCheck, createPost);
