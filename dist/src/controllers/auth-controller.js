"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
// import bcrypt from "bcryptjs";
// import { default as bcrypt } from "bcryptjs";
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = models_1.default.User;
const smsKey = process.env.SMS_KEY;
const user_repository_1 = require("../repositories/user-repository");
const sendinblue_api = require("sib-api-v3-sdk");
// import sendinblue_api from "sib-api-v3-sdk";
// // @route POST api/auth/login
// // @desc Login into account
// // @access Private
// export const register: RequestHandler = async (req, res, next) => {
//   const { email } = req.body;
//   const original_password = req.body.password;
//   let acctnum;
//   acctnum = randomString(10, NUMLIST);
//   const otp = Math.floor(1000 + Math.random() * 9000);
//   const ttl = 10 * 60 * 1000;
//   const expire = Date.now() + ttl;
//   const data = `${email}.${otp}.${expire}`;
//   const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
//   const fullhash = `${hash}.${expire}`;
//   console.log("thia is ...", User);
//   try {
//     console.log("This is ...", User);
//     const found_user = await foundUser(email);
//     console.log("This is found user....", found_user);
//     if (found_user) {
//       return next(
//         new BaseError(
//           "Account already exist, login instead!",
//           httpStatusCodes.CONFLICT
//         )
//       );
//     }
//     const existing_acct_id = await existingAcctId(acctnum);
//     console.log("this is existing account identity...", existing_acct_id);
//     if (existing_acct_id) {
//       console.log("This code block got executed!", acctnum);
//       acctnum = randomString(10, NUMLIST);
//       console.log("After the code block, here's new acctnum!", acctnum);
//     }
//     const salt = await bcrypt.genSalt();
//     const hashed_password = await bcrypt.hash(original_password, salt);
//     const payload = {
//       email: email,
//       password: hashed_password,
//       acct_id: acctnum,
//     };
//     console.log("This is user payload...", payload);
//     interface UserWithEmailHash extends User {
//       hash: string;
//     }
//     // NEW CLIENT SESSION
//     req.session.user = {
//       email: email,
//       hash: fullhash,
//     } as UserWithEmailHash; // Annotate req.session.user with UserWithEmailHash
//     console.log("This is first session... ", req.session.user);
//     req.session.save(function (err) {
//       if (err) return next(err);
//     });
//     //  FOR BREVO
//     let defaultClient = sendinblue_api.ApiClient.instance;
//     // Instantiate the client\
//     let apiKey = defaultClient.authentications["api-key"];
//     apiKey.apiKey = process.env.BREVO_API_KEY;
//     let apiInstance = new sendinblue_api.TransactionalEmailsApi();
//     const sender = {
//       email: "noreply@benkih.com",
//     };
//     const receivers = [
//       {
//         email: email,
//       },
//     ];
//     apiInstance
//       .sendTransacEmail({
//         sender,
//         to: receivers,
//         subject: "Email verification",
//         htmlContent: `
//         <h3>Hi,</h3>
//         <p>This is your otp ${otp}.Its valid for 10 minutes.</p>
//         <p>Benkih E-commerce.</p>
//       `,
//         textContent: `
//         Hi,
//         This is your otp ${otp}.
//         It expires in 10 minutes.
//         Benkih E-commerce.
//         `,
//       })
//       .then(async () => {
//         res.status(httpStatusCodes.OK).json({
//           status: "success",
//           msg: `OTP sent to ${email}, to verify your email!`,
//         });
//       })
//       .catch((error: any) => {
//         console.log("This is error: ", error);
//         return next(
//           new BaseError(
//             error.response.body.message,
//             httpStatusCodes.INTERNAL_SERVER
//           )
//         );
//       });
//     // const created_user = await createUser(payload);
//     // console.log("Created user yes...", created_user);
//     // const { id, password, ...others } = await created_user?.dataValues;
//     // const data = {
//     //   acct_id: created_user?.acct_id,
//     //   userId: created_user?.id,
//     // };
//     // console.log("This is profile data...", data);
//     // const created_profile = await createProfile(data);
//     // console.log("Created profile yes...", created_profile);
//     // res.status(httpStatusCodes.OK).json({
//     //   status: "success",
//     //   msg: "Account created!.",
//     //   data: { ...others },
//     // });
//   } catch (error: any) {
//     if (!error.statusCode) {
//       error.statusCode = httpStatusCodes.INTERNAL_SERVER;
//     }
//     next(error);
//   }
// };
// @route POST api/auth/login
// @desc Login into account
// @access Private
const login = async (req, res, next) => {
    const { email } = req.body;
    const original_password = req.body.password;
    try {
        // const foundUser = await User.findOne({
        //   attributes: ["email"],
        //   where: { email: email },
        // });
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (!found_user) {
            return next(new base_error_1.default("Error login in check credentials!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const hashedPassword = await bcrypt_1.default.compare(original_password, found_user.password);
        if (!hashedPassword) {
            return next(new base_error_1.default("Wrong password or username!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        // Session
        const { createdAt, updatedAt, ...session_data } = found_user.dataValues;
        console.log("This is the session data going to the session", session_data);
        const new_session = {
            id: session_data.id.toString(),
            acct_id: session_data.acct_id,
            email: session_data.email,
            password: session_data.password,
        };
        console.log("This is the new session...", new_session);
        req.session.user = new_session;
        // added this 30th May 2023
        req.session.save(function (err) {
            if (err)
                return next(err);
        });
        const { id, password, ...others } = found_user.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "You are logged in",
            data: { ...others },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.login = login;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(new base_error_1.default("Logout error!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        console.log("Logout successful!");
        res.status(200).json({
            status: "success",
            msg: "Logout successful!",
        });
    });
};
exports.logout = logout;
