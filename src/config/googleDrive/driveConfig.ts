import path from "node:path";
import process from "node:process";
import { google } from "googleapis";
import credentials from './credentials.json' with {type:"json"}


const CREDENTIALS_PATH = path.join(
  process.cwd(),
  "/src/config/googleDrive/credentials.json"
);
export const SCOPES = ["https://www.googleapis.com/auth/drive.file"];
export const oauth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);




