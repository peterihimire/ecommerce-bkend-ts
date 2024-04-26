import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import { foundAdmin } from "../repositories/admin-auth-repository";
import {
  foundCategories,
  foundCategoryId,
  foundCategoryName,
  createCategory,
  deleteCategoryId,
  updateCategoryId,
} from "../repositories/category-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const addCategory: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const email = admin?.email;
  const { name, desc } = req.body;

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const found_category = await foundCategoryName(name);
    if (found_category) {
      return next(
        new BaseError("Category title found.", httpStatusCodes.CONFLICT)
      );
    }

    const payload = {
      name: name as string,
      desc: desc as string,
    };

    const created_category = await createCategory(payload);
    console.log("Created category yes...", created_category);
    const { id, createdAt, updatedAt, ...others } = created_category.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Category Added!.",
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
export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const found_categories = await foundCategories();
    console.log("This are the found categories....", found_categories);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "All Categories!.",
      data: found_categories,
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
export const getCategory: RequestHandler = async (req, res, next) => {
  const { cat_id } = req.params;

  try {
    const found_category = await foundCategoryId(cat_id);
    console.log("This are the found categorys....", found_category);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Category info!.",
      data: found_category,
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
export const editCategory: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const { cat_id } = req.params;

  const email = admin?.email;
  const { name, desc } = req.body;

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const found_category = await foundCategoryId(cat_id);
    console.log("This is found category....", found_category);

    const payload = {
      name: name as string,
      desc: desc as string,
    };

    const updated_category = await updateCategoryId(cat_id, payload);
    console.log("Updated category yes...", updated_category);
    const { id, createdAt, updatedAt, ...others } = updated_category.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Category updated!.",
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
export const deleteCategory: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const { cat_id } = req.params;
  const email = admin?.email;

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    await deleteCategoryId(cat_id);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Category deleted.",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
