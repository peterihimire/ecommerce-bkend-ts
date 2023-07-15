"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownRoute = exports.returnError = exports.logErrorMiddleware = exports.logError = void 0;
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
    res.status(err.code || 500);
    res.json({
        status: "fail",
        msg: err.message || "An unknown error occurred!",
    });
};
exports.returnError = returnError;
const unknownRoute = (req, res, next) => {
    try {
        return next(new base_error_1.default("Could not find this route, make sure the URL is correct!", http_status_codes_1.httpStatusCodes.NOT_FOUND));
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.unknownRoute = unknownRoute;
