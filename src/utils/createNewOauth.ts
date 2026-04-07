import credentials from '../config/googleDrive/credentials.json' with {type:'json'}
import { google } from 'googleapis';

export default function createNewOAuth(){
const oauth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);

return oauth2Client
}