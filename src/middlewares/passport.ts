import express, { Application, Request, Response, NextFunction } from "express";
const bcrypt = require("bcryptjs");
import dotenv from "dotenv";
import passport, { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// const db = require("../database/models");
import db from "../database/models";
// const { randomString } = require("../utils/api-key-generator");
// const { CHARLIST } = require("../utils/list-data");
const smsKey = process.env.SMS_KEY;
const User = db.User;
const Wallet = db.Wallet;
import { createProfile } from "../repositories/profile-repository";
const LoginAudit = db.LoginAudit;

dotenv.config();

require("dotenv").config();

// module.exports = function (passport: any) {
export default function configurePassport(passport: PassportStatic) {
  // Configure local strategy for email/password authentication
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        // by default, local strategy uses username and password, we will override with email
        usernameField: "email",
        // passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },
      async function (
        req: Request,
        email: string,
        password: string,
        done: (error: any, user?: any, info?: any) => void
      ) {
        console.log("user req...", req.user);
        const originalPassword = password;

        try {
          const existing_user = await User.findOne({
            where: { email: email },
          });

          if (!existing_user) {
            // User not found, return false
            return done(null, false, {
              message: "Error login, check credentials!",
            });
          }

          // Check if password matches
          const hashed_password = await bcrypt.compare(
            originalPassword,
            existing_user.password
          );

          if (!hashed_password) {
            // Password doesn't match, return false
            return done(null, false, {
              message: "Wrong password or username!",
            });
          }

          // Authentication successful, return user data
          const { id, password, ...others } = existing_user.dataValues;
          return done(null, others);
        } catch (error) {
          // Error occurred, return error
          return done(error);
        }
      }
    )
  );

  // Configure Google OAuth2 strategy
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL:
          "http://127.0.0.1:4040/api/ecommerce/v1/auth/google/callback/",
        // scope: ["profile", "email"], // Adding required scopes here
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        cb: (error: any, user?: any) => void
      ) {
        console.log("Google profile object...", profile);
        // Implement your authentication logic here
        try {
          const existing_user = await User.findOne({
            where: { email: profile?.emails[0]?.value },
          });

          if (!existing_user) {
            const created_user = await User.create({
              email: profile?.emails[0]?.value,
              acct_id: profile?.id,
            });

            // GENERATE WALLET FOR NEW ACCOUNT
            const user_data = {
              acct_id: created_user?.acct_id,
              userId: created_user?.id,
              picture: profile?.photos[0]?.value,
              first_name: profile?.name?.givenName,
              last_name: profile?.name?.familyName,
            };
            await createProfile(user_data);

            const { id, password, ...others } = created_user.dataValues;
            return cb(null, others);
          }
          return cb(null, existing_user);
        } catch (err) {
          return cb(null, err);
        }
      }
    )
  );

  console.log("Operation reaching here...............");
  passport.serializeUser((user: any, done: (error: any, id?: any) => void) => {
    console.log("From passport serielize, user...", user);
    done(null, user.email);
  });

  passport.deserializeUser(
    async (email: string, done: (error: any, id?: any) => void) => {
      try {
        const user = await User.findOne({ where: { email } });
        console.log("From passport deserielize, existing_user...", user);
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  );
}

//   // serializeUser
//   console.log("Operation reaching here...............");
//   passport.serializeUser(function (user, done) {
//     console.log("From passport serielize, user...", user);
//     done(null, user.phone);
//   });

//   // deserializeUser returns the entire User data,
//   passport.deserializeUser(async function (phone, done) {
//     try {
//       const existing_user = await User.findOne({ where: { phone: phone } });
//       console.log("From passport deserielize, existing_user...", existing_user);
//       done(null, existing_user);
//     } catch (error) {
//       console.log("THisi si error...", error);
//       done(error);
//     }
//   });
// };

// module.exports = passport;

// //Persists user data inside
// passport.serializeUser(async function (user, done) {
//   console.log("From passport middleware config, user object...", user);
//   done(null, await user?.phone);
// });

// passport.deserializeUser(async function (phone, done) {
//   try {
//     const existing_user = await User.findOne({
//       where: { phone: phone },
//     });
// console.log(
//   "From passport middleware deserielize, existing_user...",
//   existing_user
// );
//     return done(null, existing_user);
//   } catch (error) {
//     return done(error);
//   }
// });

// if (!existing_user) {
//   done(
//     null,
//     false,
//     new BaseError(
//       "Account does not exist , please signup for an account!",
//       httpStatusCodes.UNAUTHORIZED
//     )
//   );
// }

// if (existing_user && existing_user.blacklist === true) {
//   done(
//     null,
//     false,
//     new BaseError(
//       "Account has been blacklisted!",
//       httpStatusCodes.UNAUTHORIZED
//     )
//   );
// }

// const hashed_password = await bcrypt.compare(
//   originalPassword,
//   existing_user.password
// );

// if (!hashed_password) {
//   done(
//     null,
//     false,
//     new BaseError(
//       "Wrong password or username!",
//       httpStatusCodes.UNAUTHORIZED
//     )
//   );
// }
