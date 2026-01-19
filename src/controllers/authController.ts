import { createUser, userExists } from "@/models/userModel.js";
import { Response, Request } from "express";
import {
  handleFormValidationError,
  createUserForm,
} from "@/config/formValidation.js";
import bcrypt from "bcryptjs";

export async function registerUser(req: Request, res: Response) {
  if (!req.body) {
    console.log("nothing fr");
    res
      .status(401)
      .json({ error: "you fucking dumbass, you didn't send anything" });
    return;
  }
  const newUser = req.body;

  try {
    createUserForm.parse(newUser, {
      reportInput: true,
    });
    //const salt = bcrypt.genSalt(10);
    const userFound = await userExists(newUser.email);
    if (userFound.length > 0) {
      return res.status(401).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    await createUser({ ...newUser, password: hashedPassword });

    return res.status(201).json({ message: "User registered!" });
  } catch (error) {
    handleFormValidationError(error, res);
  }
}
