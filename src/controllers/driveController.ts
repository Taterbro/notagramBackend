import { Response, Request } from "express";
import { SCOPES, oauth2Client } from "@/config/googleDrive/driveConfig.js";
import crypto from "crypto";
import { getUser } from "@/models/userModel.js";
import { redisClient } from "@/config/caching.js";
import { handleFormValidationError } from "@/config/formValidation.js";

export async function connectDriveAccount(req: Request, res: Response) {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "Missing parameter userId" });
    }
    const userFound = await getUser({ id: String(userId) });
    if (!userFound) {
      return res
        .status(404)
        .json({ error: "Invalid user Id; user does not exist." });
    }
    const state = crypto.randomBytes(32).toString("hex");

    await redisClient.set(state, userFound.id, {
      expiration: { type: "EX", value: 600 },
    });

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      include_granted_scopes: true,
      state: state,
    });

    return res.json({
      authorizationUrl: authorizationUrl,
      message: "authorization url sent successfully.",
    });
  } catch (err) {
    return handleFormValidationError(err, res);
  }
}

export async function getTokens(req: Request, res: Response) {
  const queries = req.query;
  if (queries.error) {
    //idk what to do here, I guess I just don't do anything...? or maybe I redirect them to an html page...? Idfk, man
    return res.send();
  } else if (queries.code) {
    const state = String(queries.state);
    const userId = await redisClient.get(state);
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Can't find the user for the specified token" });
    }
  }
  console.log("the request's queries: ", queries);
  res.send();
}
