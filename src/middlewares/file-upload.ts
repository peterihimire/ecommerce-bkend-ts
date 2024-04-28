import express, { Application, Request, Response, NextFunction } from "express";
import multer from "multer";
import BaseError from "../utils/base-error";
import { httpStatusCodes } from "../utils/http-status-codes";
import path from "path";

const file_storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, "documents/image");
  },
  filename: (req: Request, file: any, cb: Function) => {
    const ext = file.originalname.split(".").pop();
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        new Date().toISOString() +
        "." +
        ext
    );
    // cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const pic_storage = multer.diskStorage({
  destination: (req: Request, file: any, cb: Function) => {
    // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
    cb(null, "documents/picture");
  },
  filename: (req: Request, file: any, cb: Function) => {
    const ext = file.originalname.split(".").pop();
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        new Date().toISOString() +
        "." +
        ext
    );
    // cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const file_filter = (req: Request, file: any, cb: Function) => {
  const fileSize = parseInt(req.headers["content-length"] as string);
  console.log("This si req file size", fileSize);
  if (fileSize > 500000) {
    cb(
      new BaseError(
        "Images must be under 500kb!",
        httpStatusCodes.UNPROCESSABLE_ENTITY
      ),
      false
    );
  }
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new BaseError(
        "Only images are allowed!",
        httpStatusCodes.UNPROCESSABLE_ENTITY
      ),
      false
    );
  }
};

const pic_filter = (req: Request, file: any, cb: Function) => {
  const fileSize = parseInt(req.headers["content-length"] as string);
  console.log("This is the file size", fileSize);
  if (fileSize > 300000) {
    cb(
      new BaseError(
        "Images must be under 300kb!",
        httpStatusCodes.UNPROCESSABLE_ENTITY
      ),
      false
    );
  }
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new BaseError(
        "Only images are allowed!",
        httpStatusCodes.UNPROCESSABLE_ENTITY
      ),
      false
    );
  }
};

// export const productImages = multer({
//   storage: file_storage,
//   limits: { fileSize: 500000 },
//   fileFilter: file_filter,
// }).array("images", 3);

export const productImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = multer({
    storage: file_storage,
    limits: { fileSize: 500000 },
    fileFilter: file_filter,
  }).array("images", 3); // Limiting to 3 files

  // Custom middleware to check the number of files
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g. exceeding file limit)
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(
          new BaseError(
            "Cannot upload more than three (3) product images.",
            httpStatusCodes.CONFLICT
          )
        );
      }
    } else if (err) {
      // An unexpected error occurred
      return next(err);
    }
    // No error occurred, continue to the next middleware
    next();
  });
};

// export const profileImage = multer({
//   storage: pic_storage,
//   limits: { fileSize: 300000 },
//   fileFilter: pic_filter,
// }).single("picture");

export const profileImage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const upload = multer({
    storage: pic_storage,
    limits: { fileSize: 300000 },
    fileFilter: pic_filter,
  }).single("picture");

  // Custom middleware to check the number of files
  upload(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g. exceeding file limit)
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(
          new BaseError(
            "Cannot upload more than a single picture.",
            httpStatusCodes.CONFLICT
          )
        );
      }
    } else if (err) {
      // An unexpected error occurred
      return next(err);
    }
    // No error occurred, continue to the next middleware
    next();
  });
};
