import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import { foundAdmin, createAdmin } from "../repositories/admin-auth-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const register: RequestHandler = async (req, res, next) => {
  const { name, user_name, phone, email } = req.body;
  const original_password = req.body.password;

  try {
    const found_admin = await foundAdmin(email);
    console.log("This is found user....", found_admin);

    if (found_admin) {
      return next(
        new BaseError(
          `Admin with ${email} already exist, login instead!`,
          httpStatusCodes.CONFLICT
        )
      );
    }

    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(original_password, salt);

    const payload = {
      name: name,
      user_name: user_name,
      email: email,
      password: hashed_password,
      phone: phone,
    };

    const created_admin = await createAdmin(payload);
    console.log("Created admin yes...", created_admin);

    await created_admin.setRoles([3]);

    const roles = [];
    const admin_roles = await created_admin.getRoles();
    console.log(admin_roles);

    for (let i = 0; i < admin_roles.length; i++) {
      roles.push("ROLE_" + admin_roles[i].name.toUpperCase());
    }
    const { id, password, ...others } = created_admin.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: `Account with role ${roles[0]} was successfully created!`,
      data: {
        ...others,
        role: roles,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const login: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  const original_password = req.body.password;

  try {
    const found_admin = await foundAdmin(email);
    console.log("This is found admin....", found_admin);

    if (!found_admin) {
      return next(
        new BaseError(
          "Account does not exist , please signup for an account!",
          httpStatusCodes.NOT_FOUND
        )
      );
    }

    const hashedPassword = await bcrypt.compare(
      original_password,
      found_admin.password
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
    const { createdAt, updatedAt, ...session_data } = found_admin.dataValues;
    console.log("This is the session data going to the session", session_data);

    const new_session = {
      id: session_data.id.toString(),
      // acct_id: session_data.acct_id,
      email: session_data.email,
      // password: session_data.password,
    };
    console.log("This is the new session...", new_session);

    req.session.admin = new_session;

    // added this 30th May 2023
    req.session.save(function (err) {
      if (err) return next(err);
      console.log("This is saved!!!!");
    });

    const { id, password, ...others } = found_admin.dataValues;
    const authorities = [];
    const admin_roles = await found_admin.getRoles();
    // console.log(admin_roles);

    for (let i = 0; i < admin_roles.length; i++) {
      authorities.push("ROLE_" + admin_roles[i].name.toUpperCase());
    }

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: `${authorities} logged in`,
      data: {
        ...others,
        roles: authorities,
      },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
