import { passwordValidator } from "@/utils/helpers.js";
import { Response } from "express";
import * as z from "zod";

z.config({
  customError: (iss) => {
    if (iss.format === "passwordFormat") {
      passwordValidator(iss);
    }
    if (iss.code === "invalid_type") {
      return `${iss.path && String(iss.path[0])} field is required`;
    }
  },
});

export const handleFormValidationError = (error: any, res: Response) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({
      error: "Invalid field properties",
      fieldErrors: error.issues.map((issue) => ({
        [String(issue.path[0])]: issue.message,
      })),
    });
    return;
  } else {
    return res.status(500).json({ error: error.message });
  }
};

export const createUserForm = z.object({
  email: z.email().max(64),
  password: z.stringFormat(
    "passwordFormat",
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  ),
});
