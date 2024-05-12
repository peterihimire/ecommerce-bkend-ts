import db from "../database/models";
const Review = db.Review;
const Category = db.Category;

interface Category {
  review?: string;
  desc?: string;
}

export const foundReviews = async () => {
  return Review.findAll({
    attributes: {
      exclude: ["id"],
    },
  });
};

export const foundReviewId = async (id: string) => {
  return Review.findOne({
    where: { uuid: id },
  });
};

// export const foundCategoryName = async (name: string) => {
//   return Category.findOne({
//     where: { name: name },
//   });
// };

export const createReview = async (data: {
  review: string;
  name: string;
  email: string;
  rating: number;
  is_save: boolean;
  prod_id: number;
}) => {
  return Review.create({
    review: data.review,
    name: data.name,
    email: data.email,
    rating: data.rating,
    is_save: data.is_save,
    productId: data.prod_id,
  });
};

export const updateReviewId = async (id: string, data: Partial<Category>) => {
  console.log("This is data putu...", data);
  const updated_review = await foundReviewId(id);
  console.log("This is the update category...", updated_review);

  // Update the product fields if they are provided in the data
  if (data.review !== undefined) {
    updated_review.review = data.review;
  }

  return updated_review.save();
};

export const deleteReviewId = async (id: string) => {
  const deleted_review = await Review.destroy({
    where: {
      uuid: id,
    },
  });
  return deleted_review;
};
