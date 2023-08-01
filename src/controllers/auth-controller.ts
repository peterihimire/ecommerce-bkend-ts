import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
// import bcrypt from "bcryptjs";
import { default as bcrypt } from "bcryptjs";
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

  console.log("thia is ...", User);
  try {
    console.log("This is ...", User);
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
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(original_password, salt);

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
export const login: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  const original_password = req.body.password;

  try {
    const foundUser = await User.findOne({
      attributes: ["email"],
      where: { email: email },
    });

    if (!foundUser) {
      return next(
        new BaseError(
          "Error login in check credentials!",
          httpStatusCodes.CONFLICT
        )
      );
    }

    const hashedPassword = await bcrypt.compare(original_password, foundUser.password);

    if (!hashedPassword) {
      return next(
        new BaseError(
          "Wrong password or username!",
          httpStatusCodes.UNAUTHORIZED
        )
      );
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
export const logout: RequestHandler = (req, res, next) => {};
