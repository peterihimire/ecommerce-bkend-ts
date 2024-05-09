"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownRoute = exports.returnError = exports.logErrorMiddleware = exports.logError = void 0;
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
// interface LogError {
//   message: string;
//   code: number;
// }
function logError(err) {
    console.log(`error: ${err.message}, status: ${err.errorCode}`);
}
exports.logError = logError;
const logErrorMiddleware = (err, req, res, next) => {
    logError(err);
    next(err);
};
exports.logErrorMiddleware = logErrorMiddleware;
const returnError = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    // if (req.file) {
    //   fs.unlink(req.file.path, (err) => {
    //     console.log("File upload error, reverting...", err);
    //     return next(err);
    //   });
    // }
    // Check if req.file exists and has a path property
    if (req.file && req.file.path) {
        // Unlink the file
        fs_1.default.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error("File upload error, failed to unlink:", unlinkErr);
            }
            // Call next with the original error
            return next(err);
        });
    }
    res.status(err.code || 500);
    res.json({
        status: "fail",
        msg: err.message || "An unknown error occurred!",
    });
};
exports.returnError = returnError;
const unknownRoute = (req, res, next) => {
    try {
        return next(new base_error_1.default(
        // `Could not find this route: ${req.originalUrl}, make sure the URL is correct!`,
        // `Could not find this route: ${req.hostname}${req.url}, make sure the URL is correct!`,
        `Could not find this route: ${req.protocol}://${req.get("host")}${req.url}, make sure the URL is correct!`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.unknownRoute = unknownRoute;
// import express, {
//   Request,
//   Response,
//   NextFunction,
//   RequestHandler,
//   ErrorRequestHandler,
// } from "express";
// import { httpStatusCodes } from "../utils/http-status-codes";
// import BaseError from "../utils/base-error";
// // interface LogError {
// //   message: string;
// //   code: number;
// // }
// export function logError(err: any): void {
//   console.log(`error: ${err.message}, status: ${err.errorCode}`);
// }
// export const logErrorMiddleware: ErrorRequestHandler = (
//   err,
//   req,
//   res,
//   next
// ) => {
//   logError(err);
//   next(err);
// };
// export const returnError: ErrorRequestHandler = (err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   res.status(err.code || 500);
//   res.json({
//     status: "fail",
//     msg: err.message || "An unknown error occurred!",
//   });
// };
// export const unknownRoute: RequestHandler = (req, res, next) => {
//   try {
//     return next(
//       new BaseError(
//         "Could not find this route, make sure the URL is correct!",
//         httpStatusCodes.NOT_FOUND
//       )
//     );
//   } catch (error: any) {
//     if (!error.statusCode) {
//       error.statusCode = httpStatusCodes.INTERNAL_SERVER;
//     }
//     next(error);
//   }
// };
