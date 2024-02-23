"use strict";
// import { RequestHandler } from "express";
// import { httpStatusCodes } from "../utils/http-status-codes";
// import BaseError from "../utils/base-error";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProfile = exports.createUser = exports.existingAcctId = exports.foundUser = void 0;
// import bcrypt from "bcryptjs";
// import { default as bcrypt } from "bcryptjs";
// import randomString from "../utils/acc-generator";
// import { CHARLIST } from "../utils/list-data";
// import { sign, verify } from "jsonwebtoken";
// require("dotenv").config();
const models_1 = __importDefault(require("../database/models"));
const User = models_1.default.User;
const Profile = models_1.default.Profile;
const foundUser = async (email) => {
    return User.findOne({
        where: { email: email },
    });
};
exports.foundUser = foundUser;
const existingAcctId = async (acct_id) => {
    return User.findOne({
        where: { acct_id: acct_id },
    });
};
exports.existingAcctId = existingAcctId;
const createUser = async (data) => {
    return User.create({
        email: data.email,
        password: data.password,
        acct_id: data.acct_id,
    });
};
exports.createUser = createUser;
const createProfile = async (data) => {
    return Profile.create({
        // first_name: data.first_name,
        // last_name: data.last_name,
        acct_id: data.acct_id,
        userId: data.userId,
    });
};
exports.createProfile = createProfile;
// module.exports = {
//   foundUser,
//   existingAcctId,
//   createUser,
//   createProfile,
// };
