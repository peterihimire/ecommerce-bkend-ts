import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import dotenv from "dotenv";
dotenv.config();
const Product = db.Product;
const Op = db.Sequelize.Op;
import {
  foundProducts,
  foundProductId,
  foundProductTitle,
  createProduct,
  updateProductId,
  deleteProductId,
  foundProductsPag,
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
    color,
    categories,
    price,
    brand,
    countInStock,
    rating,
    desc,
    size,
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
      color: color as string,
      categories: categories as string[],
      price: parseFloat(price), // Convert price to number
      brand: brand as string,
      countInStock: parseInt(countInStock), // Convert countInStock to number
      rating: parseFloat(rating), // Convert rating to number
      desc: desc as string,
      size: size as string,
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
// @access Private//0009785185
export const getProductsFilter: RequestHandler = async (req, res, next) => {
  const {
    pageNum,
    pageSize,
    brand,
    size,
    price,
    categories,
    color,
    minPrice,
    maxPrice,
  } = req.query;

  // Define a function to calculate pagination
  const getPagination = (
    pageNumb: string | undefined,
    sizeNum: string | undefined
  ) => {
    const pageNumber: number = pageNumb ? parseInt(pageNumb, 10) : 0;
    const pageSize: number = sizeNum ? parseInt(sizeNum, 10) : 5; // Default page size to 10 if not provided

    // Provide a default value of 10 if size is falsy
    const limit: number = pageSize ? +pageSize : 10; // Default limit to 10 if size is falsy
    const offset: number = pageNumber ? pageNumber * (limit ?? 0) : 0;
    // const offset = page ? page * limit : 0;

    return { limit, offset };
  };

  // Define a function to extract paging data
  const getPagingData = (
    data: { count: number; rows: any[] },
    page: number,
    limit: number
  ) => {
    const { count: totalItems, rows: products } = data;
    const currentPage = page || 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, products, totalPages, currentPage };
  };

  // Construct the condition based on the query parameters
  let condition: any = {};
  if (brand) {
    condition.brand = { [Op.like]: `%${brand}%` };
  }
  if (color) {
    condition.color = { [Op.like]: `%${color}%` };
  }
  // SINGLE PRICE
  if (price) {
    // Assuming price is a numeric field in your database
    condition.price = { [Op.eq]: price };
  }

  // PRICE RANGE
  if (minPrice !== undefined || maxPrice !== undefined) {
    // Create an empty object to store the condition
    condition.price = {};

    // Check if minPrice is defined and set the lower bound of the range
    if (minPrice !== undefined) {
      condition.price[Op.gte] = minPrice; // Op.gte means "greater than or equal to"
    }

    // Check if maxPrice is defined and set the upper bound of the range
    if (maxPrice !== undefined) {
      condition.price[Op.lte] = maxPrice; // Op.lte means "less than or equal to"
    }
  }

  // CATEGORIES ARRAY
  if (categories) {
    condition.categories = {
      [Op.contains]: categories instanceof Array ? categories : [categories],
    };
  }
  if (size) {
    condition.size = { [Op.like]: `%${size}%` };
  }

  // const { limit, offset } = getPagination(page, size);
  try {
    const { limit, offset } = getPagination(
      pageNum as string,
      pageSize as string
    );
    const foundProducts = await foundProductsPag(condition, limit, offset);
    console.log("This are the found products....", foundProducts);

    const productsData = getPagingData(foundProducts, Number(pageNum), limit);
    const { products, totalItems, totalPages, currentPage } = productsData;
    const productRecords = products.map((product: any) => {
      const { id, createdAt, updatedAt, ...others } = product.dataValues;
      return others;
    });

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Searched Products!.",
      data: {
        totalItems,
        productRecords,
        totalPages,
        currentPage,
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
    color,
    categories,
    price,
    brand,
    countInStock,
    rating,
    desc,
    size,
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
      color: color as string,
      categories: categories as string[],
      price: parseFloat(price), // Convert price to number
      brand: brand as string,
      countInStock: parseInt(countInStock), // Convert countInStock to number
      rating: parseFloat(rating), // Convert rating to number
      desc: desc as string,
      size: size as string,
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

// const getPagingData = (
//   data: { count: number; rows: [] },
//   page: number,
//   limit: number
// ) => {
//   const { count: totalItems, rows: calls } = data;
//   const currentPage = page ? +page : 0;
//   const totalPages = Math.ceil(totalItems / limit);

//   return { totalItems, calls, totalPages, currentPage };
// };

// var condition = brand
//   ? { brand: { [Op.like]: `%${brand}%` } }
//   : color
//   ? { color: { [Op.like]: `%${color}%` } }
//   : price
//   ? { price: { [Op.like]: `%${price}%` } }
//   : categories
//   ? { categories: { [Op.like]: `%${categories}%` } }
//   : null;

// const getPagination = (page: number, size: number) => {
//   const limit: number | null = size ? +size : null; // No pagination needed add [null]
//   const offset = page ? page * (limit ?? 0) : 0; //The nullish coalescing operator (??) is used to ensure that if limit is null, it defaults to 0 when calculating the offset.

//   return { limit, offset };
// };
// const limit: number | null = pageSize || null;
// const offset: number = pageNumber ? pageNumber * (limit ?? 0) : 0;
