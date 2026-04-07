import { Response, Request } from "express";
import { SCOPES} from "@/config/googleDrive/driveConfig.js";
import crypto from "crypto";
import { editUser, getUser, setUserRefreshToken } from "@/models/userModel.js";
import { redisClient } from "@/config/caching.js";
import { handleFormValidationError } from "@/config/formValidation.js";
import url from 'node:url'
import credentials from '../config/googleDrive/credentials.json' with {type:"json"}
import createNewOAuth from "@/utils/createNewOauth.js";


export async function connectDriveAccount(req: Request, res: Response) {
  const oauth2Client = createNewOAuth();
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

export async function getAuthTokens(req: Request, res: Response) {
  const oauth2Client = createNewOAuth()
  const queries = req.query;
  let q = url.parse(req.url, true).query;
  if (queries.error) {
    return res.status(500).json({error:`Error from google auth servers: ${queries.error}`});
  } else if (queries.code) {
    const state = String(queries.state);
    const userId = await redisClient.get(state);
    if (!userId) {
      return res
        .status(400)
        .json({ message: "Can't find the user for the specified token" });
    }
    
    if (q.error) { // An error response e.g. error=access_denied
    console.log('Error:' + q.error);
    res.status(500).json({error:q.error})
  } else if (q.state !== state) { //check state value
    console.log('State mismatch. Possible CSRF attack');
    res.status(403).json({errorr:'State mismatch. Possible CSRF attack'});
  } else { // Get access and refresh tokens (if access_type is offline)

    let { tokens } = await oauth2Client.getToken(String(q.code));
    oauth2Client.setCredentials(tokens);
    if(!tokens.refresh_token){
      return res.status(500).json({error:"Something went horribly wrong while trying to get authorization tokens from google"})
    }
    if(!tokens.access_token){
      return res.status(500).json({error:"Something went horribly wrong while trying to get authorization tokens from google"})
    
    }
    await setUserRefreshToken(Number(userId),tokens.refresh_token)
    await redisClient.set(`access_token_${userId}`, tokens.access_token, {
      expiration: { type: "EX", value: 3600 },
    });

  }
  res.send();
}}

export async function getTokens(req: Request, res: Response) {
  try {
    const yes = await editUser(1, {
      name: "whooptidoo",
      pfp: "WAHOOO!!!",
    });
    console.log("yes: ", yes);
    return res.send(yes);
  } catch (error) {
    return res.send(error);
  }
}
