import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import dotenv from "dotenv";
dotenv.config();

import { foundUser } from "../repositories/user-repository";
import { updateProfile } from "../repositories/profile-repository";

// @route POST api/auth/send-otp
// @desc To send SMS OTP to user
// @access Public
export const get_user_info: RequestHandler = async (req, res, next) => {
  const { user } = req.session;
  const email = user?.email;
  console.log("This is the user session...", user);

  try {
    const found_user = await foundUser(email!);
    console.log("This is found user....", found_user);

    if (!found_user) {
      return next(
        new BaseError("User does not exist.", httpStatusCodes.NOT_FOUND)
      );
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
    const { id, password, createdAt, updatedAt, ...others } =
      found_user.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "User info!",
      data: { ...others },
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
export const updateUser: RequestHandler = async (req, res, next) => {
  const { user } = req.session;
  const email = user?.email;

  const { first_name, last_name, gender, title, phone } = req.body;

  try {
    // FOR USER
    const found_user = await foundUser(email!);
    console.log("This is found user....", found_user);

    if (!found_user) {
      return next(
        new BaseError("User does not exist.", httpStatusCodes.NOT_FOUND)
      );
    }

    const payload = {
      title: title as string,
      first_name: first_name as string,
      last_name: last_name as string,
      gender: gender as string,
      phone: phone as string,
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

    const { id, userId, createdAt, updatedAt, ...others } =
      updated_profile.dataValues;

    console.log("This is existing profile...", existing_profile);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Account info updated!.",
      data: { ...others },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// @route POST api/auth/register
// @desc To create an account
// @access Public
export const uploadPicture: RequestHandler = async (req, res, next) => {
  const { user } = req.session;
  const email = user?.email;

  const picture = req?.file?.path;

  try {
    // FOR USER
    const found_user = await foundUser(email!);
    console.log("This is found user....", found_user);

    if (!found_user) {
      return next(
        new BaseError("User does not exist.", httpStatusCodes.NOT_FOUND)
      );
    }

    const existing_profile = await found_user.getProfile({
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // PICTURE REQUIRED
    if (!req.file) {
      next(new BaseError("No picture provided!", httpStatusCodes.BAD_REQUEST));
    }

    console.log("This is existing profile...", existing_profile);

    const updated_profile = await existing_profile;
    updated_profile.picture = picture;
    updated_profile.save();

    const { id, c_code, userId, createdAt, updatedAt, ...others } =
      updated_profile.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Picture uploaded!",
      data: others,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
