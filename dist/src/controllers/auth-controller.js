"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
// import bcrypt from "bcryptjs";
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const acc_generator_1 = __importDefault(require("../utils/acc-generator"));
const list_data_1 = require("../utils/list-data");
require("dotenv").config();
const User = models_1.default.User;
const register = async (req, res, next) => {
    const { first_name, last_name, email, phone } = req.body;
    const original_password = req.body.password;
    let acctnum;
    acctnum = (0, acc_generator_1.default)(10, list_data_1.CHARLIST);
    console.log("thia is ...", User);
    try {
        console.log("This is ...", User);
        const foundUser = await User.findOne({
            attributes: ["email"],
            where: { email: email },
        });
        if (foundUser) {
            return next(new base_error_1.default("Account already exist, login instead!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_acct_id = await User.findOne({
            where: { acct_id: acctnum },
        });
        if (existing_acct_id) {
            console.log("This code block got executed!", acctnum);
            acctnum = (0, acc_generator_1.default)(10, list_data_1.CHARLIST);
            console.log("After the code block, here's new acctnum!", acctnum);
        }
        const salt = await bcryptjs_1.default.genSalt();
        const hashed_password = await bcryptjs_1.default.hash(original_password, salt);
        // CREATE NEW ACCOUNT
        const createdUser = await User.create({
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
            password: hashed_password,
            acct_id: acctnum,
        });
        const { id, password, ...others } = createdUser.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Account created!.",
            data: { ...others },
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
const login = async (req, res, next) => {
    const { email } = req.body;
    const original_password = req.body.password;
    try {
        const foundUser = await User.findOne({
            attributes: ["email"],
            where: { email: email },
        });
        if (!foundUser) {
            return next(new base_error_1.default("Error login in check credentials!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const hashedPassword = await bcryptjs_1.default.compare(original_password, foundUser.password);
        if (!hashedPassword) {
            return next(new base_error_1.default("Wrong password or username!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.login = login;
const logout = (req, res, next) => { };
exports.logout = logout;
