import { Resend } from "resend";
import { env } from "./env.js";

export const resend = new Resend(env.resendApiKey);

export const generateEmailVerificationEmail = (
  otpToken: String,
  ttl: String
) => {
  return `<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f6f8;
    font-family: Arial, Helvetica, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    style="background-color: #f4f6f8; padding: 20px 0"
  >
    <tr>
      <td align="center">
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width: 600px;
            background: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          "
        >
          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom: 20px">
              <h2 style="margin: 0; color: #222">Verify Your Email Address</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="color: #444; font-size: 15px; line-height: 1.6">
              <p style="margin: 0 0 16px 0">Hi there,</p>
              <p style="margin: 0 0 16px 0">
                Use the OTP below to verify your email address
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding: 20px 0">
              <div
                style="
                  display: inline-block;
                  padding: 14px 28px;
                  font-size: 24px;
                  letter-spacing: 4px;
                  font-weight: bold;
                  color: #111;
                  background: #f1f3f5;
                  border-radius: 6px;
                "
              >
            ${otpToken}
              </div>
            </td>
          </tr>

          <!-- Expiry Notice -->
          <tr>
            <td style="color: #444; font-size: 14px; line-height: 1.6">
              <p style="margin: 0 0 12px 0">
                This code will expire in
                <strong>${ttl} minutes, so HURRY UP!!!!!</strong>.
              </p>
              <p style="margin: 0 0 12px 0; font-size: 10px">or don't, idc</p>
              <p style="margin: 0 0 12px 0">
                If you did not request this, you can safely ignore this email —
                no changes will be made to your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #888;
                font-size: 12px;
                line-height: 1.5;
              "
            >
              <p style="margin: 0">
                For security reasons, never share this code with anyone.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>`;
};
