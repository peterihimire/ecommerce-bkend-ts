import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import { foundUser } from "../repositories/user-repository";
import {
  // foundCategories,
  // foundCategoryId,
  // foundCategoryName,
  // createCategory,
  // deleteCategoryId,
  // updateCategoryId,
  createReview,
  foundReviews,
  foundReviewId,
  deleteReviewId,
} from "../repositories/review-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const addReview: RequestHandler = async (req, res, next) => {
  const { user } = req.session;
  const reg_email = user?.email;
  const { name, email, rating, is_save, review } = req.body;

  try {
    const found_user = await foundUser(reg_email as string);
    if (!found_user) {
      return next(new BaseError("Please login!", httpStatusCodes.CONFLICT));
    }

    // const found_category = await foundCategoryName(name);
    // if (found_category) {
    //   return next(
    //     new BaseError("Category title found.", httpStatusCodes.CONFLICT)
    //   );
    // }

    const payload = {
      name: name as string,
      email: email as string,
      rating: rating as number,
      review: review as string,
      is_save: is_save as boolean,
    };

    const created_category = await createReview(payload);
    console.log("Created category yes...", created_category);
    const { id, createdAt, updatedAt, ...others } = created_category.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Review Added!.",
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
export const getReviews: RequestHandler = async (req, res, next) => {
  try {
    const found_reviews = await foundReviews();
    console.log("This are the found reviews....", found_reviews);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "All Reviews!.",
      data: found_reviews,
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
export const getReview: RequestHandler = async (req, res, next) => {
  const { cat_id } = req.params;

  try {
    const found_review = await foundReviewId(cat_id);
    console.log("This are the found categorys....", found_review);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Review info!.",
      data: found_review,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// // @route POST api/auth/login
// // @desc Login into account
// // @access Private
// export const editReview: RequestHandler = async (req, res, next) => {
//   const { admin } = req.session;
//   const { cat_id } = req.params;

//   const email = admin?.email;
//   const { name, desc } = req.body;

//   try {
//     const found_admin = await foundAdmin(email as string);
//     if (!found_admin) {
//       return next(
//         new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
//       );
//     }

//     const found_category = await foundCategoryId(cat_id);
//     console.log("This is found category....", found_category);

//     const payload = {
//       name: name as string,
//       desc: desc as string,
//     };

//     const updated_category = await updateCategoryId(cat_id, payload);
//     console.log("Updated category yes...", updated_category);
//     const { id, createdAt, updatedAt, ...others } = updated_category.dataValues;

//     res.status(httpStatusCodes.OK).json({
//       status: "success",
//       msg: "Category updated!.",
//       data: { ...others },
//     });
//   } catch (error: any) {
//     if (!error.statusCode) {
//       error.statusCode = httpStatusCodes.INTERNAL_SERVER;
//     }
//     next(error);
//   }
// };

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const deleteReview: RequestHandler = async (req, res, next) => {
  const { user } = req.session;
  const reg_email = user?.email;
  const { rev_id } = req.params;

  try {
    const found_user = await foundUser(reg_email as string);
    if (!found_user) {
      return next(new BaseError("Please login!", httpStatusCodes.CONFLICT));
    }

    await deleteReviewId(rev_id);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Review deleted.",
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
// alimony -
