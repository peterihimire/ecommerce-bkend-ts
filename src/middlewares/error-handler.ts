import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";

// interface LogError {
//   message: string;
//   code: number;
// }

export function logError(err: any): void {
  console.log(`error: ${err.message}, status: ${err.errorCode}`);
}

export const logErrorMiddleware: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  logError(err);
  next(err);
};

export const returnError: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.code || 500);
  res.json({
    status: "fail",
    msg: err.message || "An unknown error occurred!",
  });
};

export const unknownRoute: RequestHandler = (req, res, next) => {
  try {
    return next(
      new BaseError(
        "Could not find this route, make sure the URL is correct!",
        httpStatusCodes.NOT_FOUND
      )
    );
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
