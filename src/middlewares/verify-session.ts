import fs from "fs";
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  ErrorRequestHandler,
} from "express";

import BaseError from "../utils/base-error";
import { httpStatusCodes } from "../utils/http-status-codes";
import { foundAdmin, createAdmin } from "../repositories/admin-auth-repository";

// VALIDATE REGISTRATION SESSION
export const verifyClient: RequestHandler = (req, res, next) => {
  const { client } = req?.session;
  console.log("This is the session client...", client);

  if (!client) {
    return next(
      new BaseError(
        "Invalid or expired session, restart onboarding process!",
        httpStatusCodes.UNAUTHORIZED
      )
    );
  }
  req.client = client;
  next();
};

// VALIDATE USER SESSION
export const verifySession: RequestHandler = (req, res, next) => {
  const { user } = req.session;
  // const { user } = req.session as { user: any };
  console.log("This is the session user...", user);

  if (!user) {
    return next(
      new BaseError(
        "Session is invalid or expired, login to continue!",
        httpStatusCodes.UNAUTHORIZED
      )
    );
  }
  req.user = user;
  // (req as any).user = user;
  next();
};

const verifyAdmin: RequestHandler = (req, res, next) => {
  console.log("Request dot session", req?.session);
  const { admin } = req?.session; // works with the app.ts admin type
  console.log("This is the session ADMIN...", admin);

  if (!admin) {
    return next(
      new BaseError(
        "Session is invalid or expired, login to continue!",
        httpStatusCodes.UNAUTHORIZED
      )
    );
  }
  req.admin = admin; // works with the index.d.ts file
  next();
};

export const isLoggedIn: RequestHandler = (req, res, next) => {
  // passport adds this to the request object
  console.log("user object...", req.user);
  console.log("Google session object...", req.session);

  if (!req.isAuthenticated()) {
    return next(
      new BaseError("Session not valid continue!", httpStatusCodes.UNAUTHORIZED)
    );
  }
  return next();
};

// ADMIN ONLY
export const verifySessionAdmin: RequestHandler = (req, res, next) => {
  verifyAdmin(req, res, async () => {
    const admin = req.admin;

    if (!admin?.email) {
      return next(
        new BaseError(
          "Not authorised to access resource, session invalid or expired!",
          httpStatusCodes.UNAUTHORIZED
        )
      );
    }

    const found_admin = await foundAdmin(admin.email);
    console.log("This is found ADMIN...", found_admin);

    const admin_roles = await found_admin.getRoles();
    console.log("This is role ADMIN...", admin_roles);

    for (let i = 0; i < admin_roles.length; i++) {
      if (admin_roles[i].name === "admin") {
        next();
        return;
      }
    }

    return next(
      new BaseError(
        "Requires Admin Authorization!",
        httpStatusCodes.UNAUTHORIZED
      )
    );
  });
};
