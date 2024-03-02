import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import dotenv from "dotenv";
dotenv.config();
const Product = db.Product;
import {
  foundProductId,
  foundProductTitle,
  createProduct,
} from "../repositories/product-repository";
import { foundAdmin } from "../repositories/admin-auth-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const addProduct: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const email = admin?.email;
  const {
    title,
    slug,
    images,
    colors,
    categories,
    price,
    brand,
    countInStock,
    rating,
    desc,
    sizes,
    numReviews,
  } = req.body;

  console.log("thia is ...", Product);
  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    console.log("This is ...", Product);

    const found_product = await foundProductTitle(title);
    console.log("This is found product....", found_product);

    // if (found_product) {
    //   return next(
    //     new BaseError("Product title already exist.", httpStatusCodes.CONFLICT)
    //   );
    // }

    const payload = {
      title: title as string,
      slug: slug as string,
      images: images as string[], // Assuming images is an array of strings
      colors: colors as string[],
      categories: categories as string[],
      price: parseFloat(price), // Convert price to number
      brand: brand as string,
      countInStock: parseInt(countInStock), // Convert countInStock to number
      rating: parseFloat(rating), // Convert rating to number
      desc: desc as string,
      sizes: sizes as string[],
      numReviews: numReviews as string,
      // adminId: admin?.id as number,
    };

    const created_product = await createProduct(payload);
    console.log("Created product yes...", created_product);
    const { id, createdAt, updatedAt, ...others } = created_product.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Product created!.",
      data: { ...others },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
