"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_codes_1 = require("../utils/http-status-codes");
const router = (0, express_1.Router)();
const testFunction = (req, res, next) => {
    try {
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Ecommerce Test API was initiated successfully!",
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
router.get("/test-api", testFunction);
exports.default = router;
