"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReviewId = exports.updateReviewId = exports.createReview = exports.foundReviewId = exports.foundReviews = void 0;
const models_1 = __importDefault(require("../database/models"));
const Review = models_1.default.Review;
const Category = models_1.default.Category;
const foundReviews = async () => {
    return Review.findAll({
        attributes: {
            exclude: ["id"],
        },
    });
};
exports.foundReviews = foundReviews;
const foundReviewId = async (id) => {
    return Review.findOne({
        where: { uuid: id },
    });
};
exports.foundReviewId = foundReviewId;
// export const foundCategoryName = async (name: string) => {
//   return Category.findOne({
//     where: { name: name },
//   });
// };
const createReview = async (data) => {
    return Review.create({
        review: data.review,
        name: data.name,
        email: data.email,
        rating: data.rating,
        is_save: data.is_save,
        productId: data.prod_id,
    });
};
exports.createReview = createReview;
const updateReviewId = async (id, data) => {
    console.log("This is data putu...", data);
    const updated_review = await (0, exports.foundReviewId)(id);
    console.log("This is the update category...", updated_review);
    // Update the product fields if they are provided in the data
    if (data.review !== undefined) {
        updated_review.review = data.review;
    }
    return updated_review.save();
};
exports.updateReviewId = updateReviewId;
const deleteReviewId = async (id) => {
    const deleted_review = await Review.destroy({
        where: {
            uuid: id,
        },
    });
    return deleted_review;
};
exports.deleteReviewId = deleteReviewId;
