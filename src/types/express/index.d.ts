import express from "express";
import { CustomUser, Admin, Cart, Client, PassportUser } from "../types";

// This works with the verify-session file
declare global {
  namespace Express {
    interface Request {
      // user?: Record<string, any>;
      // admin?: Record<string, any>;
      user?: CustomUser;
      admin?: Admin;
      client?: Client;
      passport?: PassportUser;
    }
  }
}
