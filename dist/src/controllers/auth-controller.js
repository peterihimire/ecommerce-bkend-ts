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
// import { default as bcrypt } from "bcryptjs";
const bcrypt_1 = __importDefault(require("bcrypt"));
const acc_generator_1 = __importDefault(require("../utils/acc-generator"));
const list_data_1 = require("../utils/list-data");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = models_1.default.User;
const user_repository_1 = require("../repositories/user-repository");
const register = async (req, res, next) => {
    const { email } = req.body;
    const original_password = req.body.password;
    let acctnum;
    acctnum = (0, acc_generator_1.default)(10, list_data_1.CHARLIST);
    console.log("thia is ...", User);
    try {
        console.log("This is ...", User);
        // const foundUser = await User.findOne({
        //   attributes: ["email"],
        //   where: { email: email },
        // });
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (found_user) {
            return next(new base_error_1.default("Account already exist, login instead!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        // const existing_acct_id = await User.findOne({
        //   where: { acct_id: acctnum },
        // });
        const existing_acct_id = await (0, user_repository_1.existingAcctId)(acctnum);
        console.log("this is existing account identity...", existing_acct_id);
        if (existing_acct_id) {
            console.log("This code block got executed!", acctnum);
            acctnum = (0, acc_generator_1.default)(10, list_data_1.CHARLIST);
            console.log("After the code block, here's new acctnum!", acctnum);
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashed_password = await bcrypt_1.default.hash(original_password, salt);
        // CREATE NEW ACCOUNT
        // const createdUser = await User.create({
        //   email: email,
        //   password: hashed_password,
        //   acct_id: acctnum,
        // });
        const payload = {
            email: email,
            password: hashed_password,
            acct_id: acctnum,
        };
        const created_user = await (0, user_repository_1.createUser)(payload);
        console.log("Created user yes...", created_user);
        const { id, password, ...others } = created_user.dataValues;
        const data = {
            acct_id: created_user.acct_id,
            userId: created_user.id,
        };
        const created_profile = await (0, user_repository_1.createProfile)(data);
        console.log("Created profile yes...", created_profile);
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
        // const foundUser = await User.findOne({
        //   attributes: ["email"],
        //   where: { email: email },
        // });
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (!found_user) {
            return next(new base_error_1.default("Error login in check credentials!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const hashedPassword = await bcrypt_1.default.compare(original_password, found_user.password);
        if (!hashedPassword) {
            return next(new base_error_1.default("Wrong password or username!", http_status_codes_1.httpStatusCodes.UNAUTHORIZED));
        }
        // Session
        const { createdAt, updatedAt, ...session_data } = found_user.dataValues;
        console.log("This is the session data going to the session", session_data);
        const new_session = {
            id: session_data.id.toString(),
            acct_id: session_data.acct_id,
            email: session_data.email,
            password: session_data.password,
        };
        console.log("This is the new session...", new_session);
        req.session.user = new_session;
        // added this 30th May 2023
        req.session.save(function (err) {
            if (err)
                return next(err);
        });
        const { id, password, ...others } = found_user.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "You are logged in",
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
exports.login = login;
const logout = (req, res, next) => { };
exports.logout = logout;
