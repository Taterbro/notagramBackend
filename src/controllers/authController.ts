import { createUser } from "@/models/userModel.js";
import { Response, Request } from "express";
import {
  handleFormValidationError,
  createUserForm,
} from "@/config/formValidation.js";

export async function registerUser(req: Request, res: Response) {
  if (!req.body) {
    console.log("nothing fr");
    res.status(401).send("you fucking dumbass, you didn't send anything");
    return;
  }
  const newUser = req.body;
  try {
    createUserForm.parse(newUser);
    createUser(newUser);
    return;
  } catch (error) {
    handleFormValidationError(error, res);
  }
}
