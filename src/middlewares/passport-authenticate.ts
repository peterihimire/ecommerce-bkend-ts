import express, { Application, Request, Response, NextFunction } from "express";
// const passport = require("passport");
// require("./passport")(passport);

// Import the 'passport' module
import passport from "passport";
// Import your custom passport configuration function
import configurePassport from "./passport";
// Call the configuration function with the 'passport' instance
configurePassport(passport);

import BaseError from "../utils/base-error";
import { httpStatusCodes } from "../utils/http-status-codes";

// const httpStatusCodes = require("../utils/http-status-codes");
// const BaseError = require("../utils/base-error");

export function local_authenticate(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local-login", (err: any, user: any, info: any) => {
    console.log("This is user from authenticate", user);
    console.log("This is info from authenticate", info);
    if (err) {
      return next(err);
    }

    if (info) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        status: "fail",
        message: info.message,
      });
    }

    if (!user) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        status: "fail",
        message: "Redirect to login.",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.user = user;
      next();
    });
  })(req, res, next);
}

// Google authenticate middleware
export function google_authenticate(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
}

// Google callback handler
export function google_callback(req: Request, res: Response, next: NextFunction) {
  passport.authenticate("google", (err: any, user: any, info: any) => {
    console.log("Uuser from authenticate", user);
    console.log("Iinfo from authenticate", info);
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(httpStatusCodes.UNAUTHORIZED).json({
        status: "fail",
        message: "Redirect to login.",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(httpStatusCodes.OK).json({
        status: "success login",
        user,
      });
    });
  })(req, res, next);
}

// function google_authenticate(req, res, next) {
//   passport.authenticate("google", { scope: ["profile"] }, (err, user, info) => {
//     console.log("This is user from authenticate", user);
//     console.log("This is info from authenticate", info);

//     if (err) {
//       return next(err);
//     }

//     // if (info) {
//     //   return res.status(401).json({
//     //     status: "fail",
//     //     message: info,
//     //   });
//     // }

//     if (!user) {
//       return res.status(httpStatusCodes.UNAUTHORIZED).json({
//         status: "fail",
//         message: "Redirect to login.",
//       });
//     }

//     req.logIn(user, (err) => {
//       if (err) {
//         return next(err);
//       }
// req.user = user;
// next();
//       return res.status(httpStatusCodes.OK).json({
//         status: "success login",
//         user,
//       });
//     });
//     // return res.status(httpStatusCodes.OK).json({
//     //   status: "success login",
//     //   user,
//     // });

//     req.user = user;
//     next();
//   })(req, res, next);
// }
module.exports = {
  local_authenticate,
  google_authenticate,
  google_callback,
};
