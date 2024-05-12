"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.getReview = exports.getReviews = exports.addReview = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const user_repository_1 = require("../repositories/user-repository");
const review_repository_1 = require("../repositories/review-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addReview = async (req, res, next) => {
    const { user } = req.session;
    const reg_email = user === null || user === void 0 ? void 0 : user.email;
    const { name, email, rating, is_save, review } = req.body;
    try {
        const found_user = await (0, user_repository_1.foundUser)(reg_email);
        if (!found_user) {
            return next(new base_error_1.default("Please login!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        // const found_category = await foundCategoryName(name);
        // if (found_category) {
        //   return next(
        //     new BaseError("Category title found.", httpStatusCodes.CONFLICT)
        //   );
        // }
        const payload = {
            name: name,
            email: email,
            rating: rating,
            review: review,
            is_save: is_save,
        };
        const created_category = await (0, review_repository_1.createReview)(payload);
        console.log("Created category yes...", created_category);
        const { id, createdAt, updatedAt, ...others } = created_category.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Review Added!.",
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
exports.addReview = addReview;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getReviews = async (req, res, next) => {
    try {
        const found_reviews = await (0, review_repository_1.foundReviews)();
        console.log("This are the found reviews....", found_reviews);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "All Reviews!.",
            data: found_reviews,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getReviews = getReviews;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getReview = async (req, res, next) => {
    const { cat_id } = req.params;
    try {
        const found_review = await (0, review_repository_1.foundReviewId)(cat_id);
        console.log("This are the found categorys....", found_review);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Review info!.",
            data: found_review,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getReview = getReview;
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
const deleteReview = async (req, res, next) => {
    const { user } = req.session;
    const reg_email = user === null || user === void 0 ? void 0 : user.email;
    const { rev_id } = req.params;
    try {
        const found_user = await (0, user_repository_1.foundUser)(reg_email);
        if (!found_user) {
            return next(new base_error_1.default("Please login!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        await (0, review_repository_1.deleteReviewId)(rev_id);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Review deleted.",
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.deleteReview = deleteReview;
// alimony -
