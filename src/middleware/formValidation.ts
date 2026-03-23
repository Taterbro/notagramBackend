import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const formValidator =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.method === "GET") {
      next();
      return;
    }
    if (!req.body) {
      res
        .status(422)
        .json({ error: "you fucking dumbass, you didn't send anything" });
      return;
    }
    const requestBody = req.body;

    if (!schema) {
      next("Cannot validate form field. Schema from route does not exist");
      return;
    }

    const result = schema.safeParse(requestBody, {
      reportInput: true,
    });
    if (!result.success) {
      const statusCode = result.error.issues.some((iss) =>
        iss.message.includes("required")
      )
        ? 400
        : 422;
      console.log("le errs: ", result.error.issues);
      res.status(statusCode).json({
        error: "Invalid field properties",
        fieldErrors: result.error.issues.reduce(
          (acc, obj) => ({ ...acc, [String(obj.path[0])]: obj.message }),
          {}
        ),
      });
    } else {
      next();
    }
    return;
  };
