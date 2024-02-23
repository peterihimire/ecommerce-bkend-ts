import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
// import bcrypt from "bcryptjs";
// import { default as bcrypt } from "bcryptjs";
import bcrypt from "bcrypt";
import randomString from "../utils/acc-generator";
import { CHARLIST } from "../utils/list-data";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const User = db.User;
import {
  foundUser,
  existingAcctId,
  createUser,
  createProfile,
} from "../repositories/user-repository";

export const register: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  const original_password = req.body.password;

  let acctnum;
  acctnum = randomString(10, CHARLIST);

  console.log("thia is ...", User);
  try {
    console.log("This is ...", User);
    // const foundUser = await User.findOne({
    //   attributes: ["email"],
    //   where: { email: email },
    // });

    const found_user = await foundUser(email);
    console.log("This is found user....", found_user);

    if (found_user) {
      return next(
        new BaseError(
          "Account already exist, login instead!",
          httpStatusCodes.CONFLICT
        )
      );
    }
    // const existing_acct_id = await User.findOne({
    //   where: { acct_id: acctnum },
    // });

    const existing_acct_id = await existingAcctId(acctnum);

    console.log("this is existing account identity...", existing_acct_id);

    if (existing_acct_id) {
      console.log("This code block got executed!", acctnum);
      acctnum = randomString(10, CHARLIST);
      console.log("After the code block, here's new acctnum!", acctnum);
    }
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(original_password, salt);

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

    const created_user = await createUser(payload);
    console.log("Created user yes...", created_user);
    const { id, password, ...others } = created_user.dataValues;

    const data = {
      acct_id: created_user.acct_id,
      userId: created_user.id,
    };

    const created_profile = await createProfile(data);
    console.log("Created profile yes...", created_profile);

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
    // const foundUser = await User.findOne({
    //   attributes: ["email"],
    //   where: { email: email },
    // });

    const found_user = await foundUser(email);
    console.log("This is found user....", found_user);

    if (!found_user) {
      return next(
        new BaseError(
          "Error login in check credentials!",
          httpStatusCodes.CONFLICT
        )
      );
    }

    const hashedPassword = await bcrypt.compare(
      original_password,
      found_user.password
    );

    if (!hashedPassword) {
      return next(
        new BaseError(
          "Wrong password or username!",
          httpStatusCodes.UNAUTHORIZED
        )
      );
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
      if (err) return next(err);
    });

    const { id, password, ...others } = found_user.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "You are logged in",
      data: { ...others },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
export const logout: RequestHandler = (req, res, next) => {};
