import express, { Request, Response, NextFunction } from "express";

// function logError(err:string) {
//   console.log(`error: ${err.message}, status: ${err.code}`)
// }

function returnError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {}
