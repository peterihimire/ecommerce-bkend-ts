import express from "express";
import { User, Admin, Cart } from "../types";

// This works with the verify-session file
declare global {
  namespace Express {
    interface Request {
      // user?: Record<string, any>;
      // admin?: Record<string, any>;
      user?: User;
      admin?: Admin;
    }
  }
}
