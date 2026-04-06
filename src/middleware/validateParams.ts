import { Request, Response, NextFunction } from "express";

export const validateQueryParams =
  (requiredParameters: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const missingValues: string[] = [];
    for (const param of requiredParameters) {
      const value = req.query[param];

      if (!value) {
        missingValues.push(param);
      }
    }

    if (missingValues.length > 0) {
      return res.status(400).json({
        error: "Missing route parameters",
        routeParameters: missingValues,
      });
    } else {
      next();
      return;
    }
  };
