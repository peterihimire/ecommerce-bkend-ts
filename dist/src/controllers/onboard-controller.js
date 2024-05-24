"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_otp = exports.register = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
// import bcrypt from "bcryptjs";
// import { default as bcrypt } from "bcryptjs";
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const acc_generator_1 = __importDefault(require("../utils/acc-generator"));
const list_data_1 = require("../utils/list-data");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = models_1.default.User;
const smsKey = process.env.SMS_KEY;
const user_repository_1 = require("../repositories/user-repository");
const profile_repository_1 = require("../repositories/profile-repository");
const sendinblue_api = require("sib-api-v3-sdk");
// import sendinblue_api from "sib-api-v3-sdk";
const SibApiV3Sdk = require("sib-api-v3-typescript");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const register = async (req, res, next) => {
    const { email } = req.body;
    const original_password = req.body.password;
    let acctnum;
    acctnum = (0, acc_generator_1.default)(10, list_data_1.NUMLIST);
    const otp = Math.floor(1000 + Math.random() * 9000);
    const ttl = 10 * 60 * 1000;
    const expire = Date.now() + ttl;
    const data = `${email}.${otp}.${expire}`;
    const hash = crypto_1.default.createHmac("sha256", smsKey).update(data).digest("hex");
    const fullhash = `${hash}.${expire}`;
    console.log("thia is ...", User);
    try {
        console.log("This is ...", User);
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (found_user) {
            return next(new base_error_1.default("Account already exist, login instead!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_acct_id = await (0, user_repository_1.existingAcctId)(acctnum);
        console.log("this is existing account identity...", existing_acct_id);
        if (existing_acct_id) {
            console.log("This code block got executed!", acctnum);
            acctnum = (0, acc_generator_1.default)(10, list_data_1.NUMLIST);
            console.log("After the code block, here's new acctnum!", acctnum);
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashed_password = await bcrypt_1.default.hash(original_password, salt);
        // NEW CLIENT SESSION
        req.session.client = {
            email: email,
            password: hashed_password,
            hashes: fullhash,
        }; // Annotate req.session.user with UserWithEmailHash
        console.log("This is first session... ", req.session.client);
        req.session.save(function (err) {
            if (err)
                return next(err);
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
        sendSmtpEmail.htmlContent = `
        <h3>Hi,</h3>
        <p>This is your otp ${otp}.Its valid for 10 minutes.</p>
        <p>Benkih E-commerce.</p>
      `;
        // Send the email
        apiInstance
            .sendTransacEmail(sendSmtpEmail)
            .then((data) => {
            console.log("Email sent successfully. Response:", data);
            // Handle success
            res.status(http_status_codes_1.httpStatusCodes.OK).json({
                status: "success",
                msg: `OTP sent to ${email}, to verify your email!`,
            });
        })
            .catch((error) => {
            console.error("Error sending email:", error);
            // Handle error
            return next(new base_error_1.default(error.response.body.message, http_status_codes_1.httpStatusCodes.INTERNAL_SERVER));
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
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.register = register;
// @route PATCH api/auth/verify-otp
// @desc To verify SMS OTP recieved
// @access Public
const verify_otp = async (req, res, next) => {
    const { client } = req === null || req === void 0 ? void 0 : req.session;
    const original_hash = client === null || client === void 0 ? void 0 : client.hashes;
    // const email = client?.email;
    const { otp } = req.body;
    const now = Date.now();
    let acctnum;
    acctnum = (0, acc_generator_1.default)(10, list_data_1.NUMLIST);
    try {
        if (!original_hash) {
            return next(new base_error_1.default("Hash not available!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        // FOR OTP DECRYPTION
        const [hash, expire] = original_hash === null || original_hash === void 0 ? void 0 : original_hash.split(".");
        if (now > parseInt(expire)) {
            req.session.destroy((err) => {
                if (err) {
                    return next(new base_error_1.default("Error deleting session!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
                }
                console.log("success deleting client session...");
            });
            return next(new base_error_1.default("Timeout , OTP expired!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        const data = `${client.email}.${otp}.${expire}`;
        const verifyhash = crypto_1.default
            .createHmac("sha256", smsKey)
            .update(data)
            .digest("hex");
        if (verifyhash !== hash) {
            return next(new base_error_1.default("Invalid or incorrect OTP !", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        const found_user = await (0, user_repository_1.foundUser)(client === null || client === void 0 ? void 0 : client.email);
        console.log("This is found user....", found_user);
        if (found_user) {
            return next(new base_error_1.default("Account already exist, login instead!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_acct_id = await (0, user_repository_1.existingAcctId)(acctnum);
        console.log("this is existing account identity...", existing_acct_id);
        if (existing_acct_id) {
            console.log("This code block got executed!", acctnum);
            acctnum = (0, acc_generator_1.default)(10, list_data_1.NUMLIST);
            console.log("After the code block, here's new acctnum!", acctnum);
        }
        const payload = {
            email: client.email,
            password: client.password,
            acct_id: acctnum,
        };
        const created_user = await (0, user_repository_1.createUser)(payload);
        console.log("Created user yes...", created_user);
        const { id, password, ...others } = await (created_user === null || created_user === void 0 ? void 0 : created_user.dataValues);
        const user_data = {
            acct_id: created_user === null || created_user === void 0 ? void 0 : created_user.acct_id,
            userId: created_user === null || created_user === void 0 ? void 0 : created_user.id,
        };
        console.log("This is profile data...", user_data);
        const created_profile = await (0, profile_repository_1.createProfile)(user_data);
        console.log("Created profile yes...", created_profile);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Account created.",
            data: others,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.verify_otp = verify_otp;
// // @route POST api/auth/login
// // @desc Login into account
// // @access Private
// export const login: RequestHandler = async (req, res, next) => {
//   const { email } = req.body;
//   const original_password = req.body.password;
//   try {
//     // const foundUser = await User.findOne({
//     //   attributes: ["email"],
//     //   where: { email: email },
//     // });
//     const found_user = await foundUser(email);
//     console.log("This is found user....", found_user);
//     if (!found_user) {
//       return next(
//         new BaseError(
//           "Error login in check credentials!",
//           httpStatusCodes.CONFLICT
//         )
//       );
//     }
//     const hashedPassword = await bcrypt.compare(
//       original_password,
//       found_user.password
//     );
//     if (!hashedPassword) {
//       return next(
//         new BaseError(
//           "Wrong password or username!",
//           httpStatusCodes.UNAUTHORIZED
//         )
//       );
//     }
//     // Session
//     const { createdAt, updatedAt, ...session_data } = found_user.dataValues;
//     console.log("This is the session data going to the session", session_data);
//     const new_session = {
//       id: session_data.id.toString(),
//       acct_id: session_data.acct_id,
//       email: session_data.email,
//       password: session_data.password,
//     };
//     console.log("This is the new session...", new_session);
//     req.session.user = new_session;
//     // added this 30th May 2023
//     req.session.save(function (err) {
//       if (err) return next(err);
//     });
//     const { id, password, ...others } = found_user.dataValues;
//     res.status(httpStatusCodes.OK).json({
//       status: "success",
//       msg: "You are logged in",
//       data: { ...others },
//     });
//   } catch (error: any) {
//     if (!error.statusCode) {
//       error.statusCode = httpStatusCodes.INTERNAL_SERVER;
//     }
//     next(error);
//   }
// };
// // @route POST api/auth/login
// // @desc Login into account
// // @access Private
// export const logout: RequestHandler = (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return next(new BaseError("Logout error!", httpStatusCodes.UNAUTHORIZED));
//     }
//     console.log("Logout successful!");
//     res.status(200).json({
//       status: "success",
//       msg: "Logout successful!",
//     });
//   });
// };
