import { Request, Response, NextFunction } from "express";

export interface expressRequest {
  req: Request;
  res?: Response;
  next?: NextFunction;
}
