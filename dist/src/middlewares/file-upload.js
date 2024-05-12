"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileImage = exports.productImages = void 0;
const multer_1 = __importDefault(require("multer"));
const base_error_1 = __importDefault(require("../utils/base-error"));
const http_status_codes_1 = require("../utils/http-status-codes");
const file_storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
        cb(null, "documents/image");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, file.originalname.split(".")[0] +
            "-" +
            new Date().toISOString() +
            "." +
            ext);
        // cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const pic_storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // console.log("🚀 ~ file: upload.ts:11 ~ file", process.cwd());
        cb(null, "documents/picture");
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        cb(null, file.originalname.split(".")[0] +
            "-" +
            new Date().toISOString() +
            "." +
            ext);
        // cb(null, new Date().toISOString() + "-" + file.originalname);
    },
});
const file_filter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    console.log("This si req file size", fileSize);
    if (fileSize > 500000) {
        cb(new base_error_1.default("Images must be under 500kb!", http_status_codes_1.httpStatusCodes.UNPROCESSABLE_ENTITY), false);
    }
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new base_error_1.default("Only images are allowed!", http_status_codes_1.httpStatusCodes.UNPROCESSABLE_ENTITY), false);
    }
};
const pic_filter = (req, file, cb) => {
    const fileSize = parseInt(req.headers["content-length"]);
    console.log("This is the file size", fileSize);
    if (fileSize > 300000) {
        cb(new base_error_1.default("Images must be under 300kb!", http_status_codes_1.httpStatusCodes.UNPROCESSABLE_ENTITY), false);
    }
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    }
    else {
        cb(new base_error_1.default("Only images are allowed!", http_status_codes_1.httpStatusCodes.UNPROCESSABLE_ENTITY), false);
    }
};
// export const productImages = multer({
//   storage: file_storage,
//   limits: { fileSize: 500000 },
//   fileFilter: file_filter,
// }).array("images", 3);
const productImages = (req, res, next) => {
    const upload = (0, multer_1.default)({
        storage: file_storage,
        limits: { fileSize: 500000 },
        fileFilter: file_filter,
    }).array("images", 3); // Limiting to 3 files
    // Custom middleware to check the number of files
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred (e.g. exceeding file limit)
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return next(new base_error_1.default("Cannot upload more than three (3) product images.", http_status_codes_1.httpStatusCodes.CONFLICT));
            }
        }
        else if (err) {
            // An unexpected error occurred
            return next(err);
        }
        // No error occurred, continue to the next middleware
        next();
    });
};
exports.productImages = productImages;
// export const profileImage = multer({
//   storage: pic_storage,
//   limits: { fileSize: 300000 },
//   fileFilter: pic_filter,
// }).single("picture");
const profileImage = (req, res, next) => {
    const upload = (0, multer_1.default)({
        storage: pic_storage,
        limits: { fileSize: 300000 },
        fileFilter: pic_filter,
    }).single("picture");
    // Custom middleware to check the number of files
    upload(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            // A Multer error occurred (e.g. exceeding file limit)
            if (err.code === "LIMIT_UNEXPECTED_FILE") {
                return next(new base_error_1.default("Cannot upload more than a single picture.", http_status_codes_1.httpStatusCodes.CONFLICT));
            }
        }
        else if (err) {
            // An unexpected error occurred
            return next(err);
        }
        // No error occurred, continue to the next middleware
        next();
    });
};
exports.profileImage = profileImage;
