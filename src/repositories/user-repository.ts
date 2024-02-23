// import { RequestHandler } from "express";
// import { httpStatusCodes } from "../utils/http-status-codes";
// import BaseError from "../utils/base-error";

// import bcrypt from "bcryptjs";
// import { default as bcrypt } from "bcryptjs";
// import randomString from "../utils/acc-generator";
// import { CHARLIST } from "../utils/list-data";
// import { sign, verify } from "jsonwebtoken";
// require("dotenv").config();
import db from "../database/models";
const User = db.User;
const Profile = db.Profile;

export const foundUser = async (email: string) => {
  return User.findOne({
    where: { email: email },
  });
};

export const existingAcctId = async (acct_id: string) => {
  return User.findOne({
    where: { acct_id: acct_id },
  });
};

export const createUser = async (data: {
  email: string;
  password: string;
  acct_id: string;
}) => {
  return User.create({
    email: data.email,
    password: data.password,
    acct_id: data.acct_id,
  });
};

export const createProfile = async (data: {
  // first_name: string;
  // last_name: string;
  acct_id: string;
  userId: number;
}) => {
  return Profile.create({
    // first_name: data.first_name,
    // last_name: data.last_name,
    acct_id: data.acct_id,
    userId: data.userId,
  });
};

// module.exports = {
//   foundUser,
//   existingAcctId,
//   createUser,
//   createProfile,
// };
