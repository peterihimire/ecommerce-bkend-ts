"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySessionAdmin = exports.verifySessionAndAuthorization = exports.verifySession = void 0;
const base_error_1 = __importDefault(require("../utils/base-error"));
const http_status_codes_1 = require("../utils/http-status-codes");
// VALIDATE USER SESSION
const verifySession = (req, res, next) => {
    const { user } = req.session;
    // const { user } = req.session as { user: any };
    console.log("This is the session user...", user);
    if (!user) {
        return next(new base_error_1.default("Session is invalid or expired, login to continue!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
    }
    req.user = user;
    // (req as any).user = user;
    next();
};
exports.verifySession = verifySession;
const verifyAdmin = (req, res, next) => {
    const { admin } = req.session; // works with the app.ts admin type
    console.log("This is the session ADMIN...", admin);
    if (!admin) {
        return next(new base_error_1.default("Session is invalid or expired, login to continue!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
    }
    req.admin = admin; // works with the index.d.ts file
    next();
};
// USER ONLY
const verifySessionAndAuthorization = (req, res, next) => {
    (0, exports.verifySession)(req, res, async () => {
        var _a, _b;
        const user = req.user;
        const user_id = ((_a = req.body) === null || _a === void 0 ? void 0 : _a.id) || ((_b = req.params) === null || _b === void 0 ? void 0 : _b.id);
        if (!(user === null || user === void 0 ? void 0 : user.email)) {
            return next(new base_error_1.default("Session invalid or expired!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        if ((user === null || user === void 0 ? void 0 : user.id) === user_id || (user === null || user === void 0 ? void 0 : user.id)) {
            next();
            return;
        }
        return next(new base_error_1.default("Requires User Authorization!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
    });
};
exports.verifySessionAndAuthorization = verifySessionAndAuthorization;
// ADMIN ONLY
const verifySessionAdmin = (req, res, next) => {
    verifyAdmin(req, res, async () => {
        const admin = req.admin;
        if (!(admin === null || admin === void 0 ? void 0 : admin.email)) {
            return next(new base_error_1.default("Session invalid or expired!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        const found_admin = await admin.findOne({
            where: { email: admin.email },
        });
        console.log("This is found ADMIN...", found_admin);
        const admin_roles = await found_admin.getRoles();
        console.log("This is role ADMIN...", admin_roles);
        for (let i = 0; i < admin_roles.length; i++) {
            if (admin_roles[i].name === "admin") {
                next();
                return;
            }
        }
        return next(new base_error_1.default("Requires Admin Authorization!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
    });
};
exports.verifySessionAdmin = verifySessionAdmin;
