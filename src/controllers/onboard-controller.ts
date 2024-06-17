import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import bcrypt from "bcrypt";
import crypto from "crypto";
import randomString from "../utils/acc-generator";
import { NUMLIST } from "../utils/list-data";
import dotenv from "dotenv";
dotenv.config();
const User = db.User;
const smsKey: string = process.env.SMS_KEY!;
import {
  foundUser,
  existingAcctId,
  createUser,
} from "../repositories/user-repository";
import { CustomUser, Client } from "../types/types";
import { createProfile } from "../repositories/profile-repository";
const sendinblue_api = require("sib-api-v3-sdk");
// import sendinblue_api from "sib-api-v3-sdk";
const SibApiV3Sdk = require("sib-api-v3-typescript");

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const register: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  const original_password = req.body.password;

  let acctnum;
  acctnum = randomString(10, NUMLIST);
  const otp = Math.floor(1000 + Math.random() * 9000);
  const ttl = 10 * 60 * 1000;
  const expire = Date.now() + ttl;
  const data = `${email}.${otp}.${expire}`;
  const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
  const fullhash = `${hash}.${expire}`;

  // console.log("thia is ...", User);
  try {
    // console.log("This is ...", User);

    const found_user = await foundUser(email);
    // console.log("This is found user....", found_user);

    if (found_user) {
      return next(
        new BaseError(
          "Account already exist, login instead!",
          httpStatusCodes.CONFLICT
        )
      );
    }

    const existing_acct_id = await existingAcctId(acctnum);

    // console.log("this is existing account identity...", existing_acct_id);

    if (existing_acct_id) {
      // console.log("This code block got executed!", acctnum);
      acctnum = randomString(10, NUMLIST);
      // console.log("After the code block, here's new acctnum!", acctnum);
    }
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(original_password, salt);

    // NEW CLIENT SESSION
    req.session.client = {
      email: email,
      password: hashed_password,
      hashes: fullhash,
    }; // Annotate req.session.user with UserWithEmailHash

    console.log("This is first session... ", req.session.client);
    req.session.save(function (err) {
      if (err) return next(err);
    });

    // // HOW TO EXTEND A TYPE (INTERFACE)
    // interface UserWithEmailHash extends User {
    //   hash: string;
    // }

    // // NEW CLIENT SESSION
    // req.session.user = {
    //   email: email,
    //   hash: fullhash,
    // } as UserWithEmailHash; // Annotate req.session.user with UserWithEmailHash

    // BREVO TYPESCRIPT
    // Initialize the TransactionalEmailsApi instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Set your Sendinblue API key
    const apiKey = apiInstance.authentications["apiKey"];
    apiKey.apiKey = process.env.BREVO_API_KEY; // Replace with your API key

    // Create a new instance of SendSmtpEmail to specify email details
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set the sender details
    sendSmtpEmail.sender = {
      name: "Benkih",
      email: "support@benkih.com",
    };

    // Set the recipient email address
    sendSmtpEmail.to = [{ email }];

    // Set the subject and content of the email
    sendSmtpEmail.subject = "Email Verification";
    sendSmtpEmail.htmlContent = `<!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    @media screen and (max-width: 600px) {
                      .content {
                          width: 100% !important;
                          display: block !important;
                          padding: 0px !important;
                      }
                       .container {
                          padding: 10px !important;
                      }
                       .wrapper {
                          width: 100% !important;
                          display: block !important;
                     
                      }
                      .header {
                          padding-bottom: 10px !important;
                          font-size: 20px !important;
                      }
                       .logo{
                          width: 40px !important;
                          margin-right: 4px !important;
                        }
                      .body{
                          padding-bottom: 10px !important;
                          padding-top: 10px !important;
                      }

                      .footer {
                     
                          padding-top: 10px !important;
                      }
                    }
                  </style>
                  <title>benkih e-commeerce</title>
                </head>
                <body style="font-family: 'Poppins', Arial, sans-serif">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="center" style="padding: 20px;">
                         <table class="wrapper" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 1px solid #cccccc;">
                           <tr>
                           <td class="container" align="center" style="padding: 40px;">
                          <table class="content" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: 0px solid #cccccc;">
                              <!-- Header -->
                              <tr>
                                  <td class="header" style="padding-bottom: 40px; text-align: left; color: grey; font-size: 30px; font-weight:bolder; border-bottom: 1px solid #cccccc;">
                                    <img src="https://res.cloudinary.com/dymhdpka1/image/upload/v1714244037/peterihimire-logo_whf5lr.png" alt="Benkih E-commerce Logo" style="width: 80px; height: auto; vertical-align: middle; margin-right: 8px;" class="logo" /> Benkih
                                  </td>
                              </tr>

                              <!-- Body -->
                              <tr>
                                  <td class="body" style="padding-bottom: 40px;padding-top: 40px; text-align: left; font-size: 16px; line-height: 1.6;">
                                  <strong>Hello,</strong> <br>
                                  Welcome to the Benkih e-commerce, we are glad you decided to take the step to check out what our community has to offer you.
                                  <br><br>
                                  Verification Code <br>
                                  <strong>${otp}</strong> <br><br>
                                  This single-use code is valid for ten minutes.     
                                  </td>
                              </tr>

                              <!-- Footer -->
                              <tr>
                                <td class="footer" style="padding-top: 40px; text-align: left; color: #333333;; font-size: 14px; border-top: 1px solid #cccccc;">
                                  This message was sent automatically by <a href='https://ecommerce.benkih.com' style="color: blue; text-decoration: none;" target="_blank">ecommerce.benkih.com</a>. Do not reply to this message as no response will be given.
                                </td>
                              </tr>
                          </table>
                           </td>
                          </tr>
                         </table>
                        </td>
                      </tr>
                  </table>
                </body>
              </html>`;

    // Send the email
    apiInstance
      .sendTransacEmail(sendSmtpEmail)
      .then((data: any) => {
        // console.log("Email sent successfully. Response:", data);
        // Handle success
        res.status(httpStatusCodes.OK).json({
          status: "success",
          msg: `OTP sent to ${email}, to verify your email!`,
        });
      })
      .catch((error: any) => {
        console.error("Error sending email:", error);
        // Handle error
        return next(
          new BaseError(
            error.response.body.message,
            httpStatusCodes.INTERNAL_SERVER
          )
        );
      });

    // //  FOR BREVO
    // let defaultClient = sendinblue_api.ApiClient.instance;
    // // Instantiate the client\
    // let apiKey = defaultClient.authentications["api-key"];
    // apiKey.apiKey = process.env.BREVO_API_KEY;
    // let apiInstance = new sendinblue_api.TransactionalEmailsApi();

    // const sender = {
    //   email: "noreply@benkih.com",
    // };
    // const receivers = [
    //   {
    //     email: email,
    //   },
    // ];

    // apiInstance
    //   .sendTransacEmail({
    //     sender,
    //     to: receivers,
    //     subject: "Email verification",
    //     attachmentUrl: "",
    //     htmlContent: `
    // <h3>Hi,</h3>
    // <p>This is your otp ${otp}.Its valid for 10 minutes.</p>
    // <p>Benkih E-commerce.</p>
    //   `,
    //     textContent: `
    //     Hi,
    //     This is your otp ${otp}.
    //     It expires in 10 minutes.
    //     Benkih E-commerce.
    //     `,
    //   })
    //   .then(async () => {
    // res.status(httpStatusCodes.OK).json({
    //   status: "success",
    //   msg: `OTP sent to ${email}, to verify your email!`,
    // });
    //   })
    //   .catch((error: any) => {
    //     console.log("This is error: ", error);
    //     return next(
    //       new BaseError(
    //         // error.response.body.message,
    //         error,
    //         httpStatusCodes.INTERNAL_SERVER
    //       )
    //     );
    //   });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// @route PATCH api/auth/verify-otp
// @desc To verify SMS OTP recieved
// @access Public
export const verify_otp: RequestHandler = async (req, res, next) => {
  const { client } = req?.session;
  const original_hash = client?.hashes;
  // const email = client?.email;
  const { otp } = req.body;
  const now = Date.now();

  let acctnum;
  acctnum = randomString(10, NUMLIST);

  try {
    if (!original_hash) {
      return next(
        new BaseError("Hash not available!", httpStatusCodes.UNAUTHORIZED)
      );
    }
    // FOR OTP DECRYPTION
    const [hash, expire] = original_hash?.split(".");
    if (now > parseInt(expire)) {
      req.session.destroy((err) => {
        if (err) {
          return next(
            new BaseError(
              "Error deleting session!",
              httpStatusCodes.UNAUTHORIZED
            )
          );
        }
        console.log("success deleting client session...");
      });
      return next(
        new BaseError("Timeout , OTP expired!", httpStatusCodes.UNAUTHORIZED)
      );
    }

    const data = `${client.email}.${otp}.${expire}`;

    const verifyhash = crypto
      .createHmac("sha256", smsKey)
      .update(data)
      .digest("hex");

    if (verifyhash !== hash) {
      return next(
        new BaseError(
          "Invalid or incorrect OTP !",
          httpStatusCodes.UNAUTHORIZED
        )
      );
    }

    const found_user = await foundUser(client?.email);
    console.log("This is found user....", found_user);

    if (found_user) {
      return next(
        new BaseError(
          "Account already exist, login instead!",
          httpStatusCodes.CONFLICT
        )
      );
    }

    const existing_acct_id = await existingAcctId(acctnum);

    // console.log("this is existing account identity...", existing_acct_id);

    if (existing_acct_id) {
      // console.log("This code block got executed!", acctnum);
      acctnum = randomString(10, NUMLIST);
      // console.log("After the code block, here's new acctnum!", acctnum);
    }

    const payload = {
      email: client.email,
      password: client.password,
      acct_id: acctnum,
    };

    const created_user = await createUser(payload);
    // console.log("Created user yes...", created_user);
    const { id, password, ...others } = await created_user?.dataValues;

    const user_data = {
      acct_id: created_user?.acct_id,
      userId: created_user?.id,
    };
    // console.log("This is profile data...", user_data);
    const created_profile = await createProfile(user_data);
    console.log("Created profile yes...", created_profile);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Account created.",
      data: others,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
