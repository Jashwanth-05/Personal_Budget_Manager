const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

const sendOTP = async (email, otp) => {
  try {
    console.log("🔹 Fetching access token...");
    const accessToken = await oAuth2Client.getAccessToken();
    console.log("✅ Access Token:", accessToken.token || "Undefined");

    console.log("🔹 Creating transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    console.log("🔹 Sending email to:", email);
    const mailOptions = {
      from: `"PDM App Support" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
          <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Verification Code</h2>
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Use the following verification code to reset your password:</p>
            <h3 style="background: #007bff; color: white; padding: 10px; text-align: center; border-radius: 4px;">${otp}</h3>
            <p style="font-size: 14px; color: #666;">If you did not request this code, you can safely ignore this email.</p>
            <p style="font-size: 14px; color: #666;">Best Regards, <br> PDM App Team</p>
            <hr style="border: 0.5px solid #ddd;">
            <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message. Please do not reply.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ OTP sent successfully to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP:", error.response || error);
    return false;
  }
};

module.exports = sendOTP;
