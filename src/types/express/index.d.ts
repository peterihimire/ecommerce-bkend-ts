import express from "express";

// This works with the verify-session file
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      admin?: Record<string, any>;
    }
  }
}
