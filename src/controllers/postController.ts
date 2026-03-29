import { Response, Request } from "express";

export async function createPost(req: Request, res: Response) {
  return res.json({ message: "Mock data. Post created, dawg" });
}
