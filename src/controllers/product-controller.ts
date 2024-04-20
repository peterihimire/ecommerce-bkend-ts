import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import dotenv from "dotenv";
dotenv.config();
const Product = db.Product;
import {
  foundProducts,
  foundProductId,
  foundProductTitle,
  createProduct,
  updateProductId,
  deleteProductId,
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

    const found_product = await foundProductTitle(title);
    if (found_product) {
      return next(
        new BaseError("Product title found.", httpStatusCodes.CONFLICT)
      );
    }
    console.log("This is found product....", found_product);

    const images = req.files;
    console.log("this is the images", images);

    const imagesPathArray = (images as Express.Multer.File[]).map((img) => {
      return img.path;
    });

    console.log("images url array ...", imagesPathArray);

    const payload = {
      title: title as string,
      slug: slug as string,
      images: imagesPathArray as string[], // Assuming images is an array of strings
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

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const found_products = await foundProducts();
    console.log("This are the found products....", found_products);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "All Products!.",
      data: found_products,
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
export const getProduct: RequestHandler = async (req, res, next) => {
  const { prod_id } = req.params;

  try {
    const found_product = await foundProductId(prod_id);
    console.log("This are the found products....", found_product);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Product info!.",
      data: found_product,
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
export const editProduct: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const { prod_id } = req.params;

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

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const found_product = await foundProductId(prod_id);
    console.log("This is found product....", found_product);

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

    const updated_product = await updateProductId(prod_id, payload);
    console.log("Updated product yes...", updated_product);
    const { id, createdAt, updatedAt, ...others } = updated_product.dataValues;

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Product updated!.",
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
export const deleteProduct: RequestHandler = async (req, res, next) => {
  const { admin } = req.session;
  const { prod_id } = req.params;
  const email = admin?.email;

  try {
    const found_admin = await foundAdmin(email as string);
    if (!found_admin) {
      return next(
        new BaseError("Admin does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    await deleteProductId(prod_id);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Product deleted.",
      // data: { ...others },
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
