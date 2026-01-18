import { createUser } from "@/models/userModel.js";
import * as z from "zod";
import { Response, Request } from "express";

z.config({
  customError: (iss) => {
    if (iss.code === "invalid_type") {
      return `${iss.path && String(iss.path[0])} field is required`;
    }
  },
});
const User = z.object({
  email: z.email(),
  name: z.string().optional(),
  password: z.string().min(8).trim().max(32),
  pfp: z.string().optional(),
});

export async function registerUser(req: Request, res: Response) {
  if (!req.body) {
    console.log("nothing fr");
    res.status(401).send("you fucking dumbass, you didn't send anything");
    return;
  }
  const newUser = req.body;
  try {
    User.parse(newUser);
    createUser(newUser);
    return;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("zod errors are: ", error.issues);
      res.status(400).json({
        message: "Invalid field properties",
        fieldErrors: error.issues.map((issue) => ({
          [String(issue.path[0])]: issue.message,
        })),
      });
      return;
    }
  }
}
