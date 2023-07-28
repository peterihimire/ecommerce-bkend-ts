import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import bcrypt from "bcryptjs";
import randomString from "../utils/acc-generator";
import { CHARLIST } from "../utils/list-data";
import { sign, verify } from "jsonwebtoken";
require("dotenv").config();
const User = db.User;

export const register: RequestHandler = async (req, res, next) => {
  const { first_name, last_name, email, phone } = req.body;
  const original_password = req.body.password;
  let acctnum;
  acctnum = randomString(10, CHARLIST);

  try {
    const foundUser = await User.findOne({
      attributes: ["email"],
      where: { email: email },
    });

    if (foundUser) {
      return next(
        new BaseError(
          "Account already exist, login instead!",
          httpStatusCodes.CONFLICT
        )
      );
    }
    const existing_acct_id = await User.findOne({
      where: { acct_id: acctnum },
    });
    if (existing_acct_id) {
      console.log("This code block got executed!", acctnum);
      acctnum = randomString(10, CHARLIST);
      console.log("After the code block, here's new acctnum!", acctnum);
    }
    const hashed_password = await bcrypt.hash(original_password, 10);

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

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Account created!.",
      data: { ...others },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
export const login: RequestHandler = (req, res, next) => {};
export const logout: RequestHandler = (req, res, next) => {};
