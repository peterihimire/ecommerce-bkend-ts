"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(message, errorCode) {
        super(message);
        this.message = message;
        this.errorCode = errorCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this);
    }
}
exports.default = BaseError;
