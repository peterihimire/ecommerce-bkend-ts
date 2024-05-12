"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPicture = exports.updateUser = exports.getUserInfo = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_repository_1 = require("../repositories/user-repository");
// @route POST api/auth/send-otp
// @desc To send SMS OTP to user
// @access Public
const getUserInfo = async (req, res, next) => {
    const { user } = req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    console.log("This is the user session...", user);
    try {
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (!found_user) {
            return next(new base_error_1.default("User does not exist.", http_status_codes_1.httpStatusCodes.NOT_FOUND));
        }
        // if (found_user && found_user.blacklist === true) {
        //   return next(
        //     new BaseError(
        //       "Account has been blacklisted!",
        //       httpStatusCodes.NOT_FOUND
        //     )
        //   );
        // }
        console.log("THIS is found user...", found_user);
        const { id, password, createdAt, updatedAt, ...others } = found_user.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "User info!",
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
exports.getUserInfo = getUserInfo;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const updateUser = async (req, res, next) => {
    const { user } = req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    const { first_name, last_name, gender, title, phone } = req.body;
    try {
        // FOR USER
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (!found_user) {
            return next(new base_error_1.default("User does not exist.", http_status_codes_1.httpStatusCodes.NOT_FOUND));
        }
        const payload = {
            title: title,
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            phone: phone,
        };
        const existing_profile = await found_user.getProfile({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        const updated_profile = await existing_profile;
        updated_profile.first_name = first_name;
        updated_profile.last_name = last_name;
        updated_profile.gender = gender;
        updated_profile.title = title;
        updated_profile.phone = phone;
        updated_profile.save();
        const { id, userId, createdAt, updatedAt, ...others } = updated_profile.dataValues;
        console.log("This is existing profile...", existing_profile);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Account info updated!.",
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
exports.updateUser = updateUser;
// @route POST api/auth/register
// @desc To create an account
// @access Public
const uploadPicture = async (req, res, next) => {
    var _a;
    const { user } = req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        // FOR USER
        const found_user = await (0, user_repository_1.foundUser)(email);
        console.log("This is found user....", found_user);
        if (!found_user) {
            return next(new base_error_1.default("User does not exist.", http_status_codes_1.httpStatusCodes.NOT_FOUND));
        }
        const existing_profile = await found_user.getProfile({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });
        const picture = (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path;
        // PICTURE REQUIRED
        if (!req.file) {
            next(new base_error_1.default("No picture provided!", http_status_codes_1.httpStatusCodes.BAD_REQUEST));
        }
        console.log("This is existing profile...", existing_profile);
        const updated_profile = await existing_profile;
        updated_profile.picture = picture;
        updated_profile.save();
        const { id, c_code, userId, createdAt, updatedAt, ...others } = updated_profile.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Picture uploaded!",
            data: others,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.uploadPicture = uploadPicture;
