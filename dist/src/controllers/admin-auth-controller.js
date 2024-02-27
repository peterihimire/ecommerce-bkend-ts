"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const admin_auth_repository_1 = require("../repositories/admin-auth-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const register = async (req, res, next) => {
    const { name, user_name, phone, email } = req.body;
    const original_password = req.body.password;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        console.log("This is found user....", found_admin);
        if (found_admin) {
            return next(new base_error_1.default(`Admin with ${email} already exist, login instead!`, http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashed_password = await bcrypt_1.default.hash(original_password, salt);
        const payload = {
            name: name,
            user_name: user_name,
            email: email,
            password: hashed_password,
            phone: phone,
        };
        const created_admin = await (0, admin_auth_repository_1.createAdmin)(payload);
        console.log("Created admin yes...", created_admin);
        await created_admin.setRoles([3]);
        const roles = [];
        const admin_roles = await created_admin.getRoles();
        console.log(admin_roles);
        for (let i = 0; i < admin_roles.length; i++) {
            roles.push("ROLE_" + admin_roles[i].name.toUpperCase());
        }
        const { id, password, ...others } = created_admin.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: `Account with role ${roles[0]} was successfully created!`,
            data: {
                ...others,
                role: roles,
            },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.register = register;
