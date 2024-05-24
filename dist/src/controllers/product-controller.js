"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.editProduct = exports.getProduct = exports.getProductsFilter = exports.getProducts = exports.addProduct = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Product = models_1.default.Product;
const Op = models_1.default.Sequelize.Op;
const product_repository_1 = require("../repositories/product-repository");
const admin_auth_repository_1 = require("../repositories/admin-auth-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addProduct = async (req, res, next) => {
    const { admin } = req.session;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    const { title, slug, color, categories, price, brand, countInStock, rating, desc, size, numReviews, } = req.body;
    console.log("thia is ...", Product);
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const found_product = await (0, product_repository_1.foundProductTitle)(title);
        if (found_product) {
            return next(new base_error_1.default("Product title found.", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        console.log("This is found product....", found_product);
        const images = req.files;
        console.log("this is the images", images);
        const imagesPathArray = images.map((img) => {
            return img.path;
        });
        console.log("images url array ...", imagesPathArray);
        const payload = {
            title: title,
            slug: slug,
            images: imagesPathArray, // Assuming images is an array of strings
            color: color,
            categories: categories,
            price: parseFloat(price), // Convert price to number
            brand: brand,
            countInStock: parseInt(countInStock), // Convert countInStock to number
            rating: parseFloat(rating), // Convert rating to number
            desc: desc,
            size: size,
            numReviews: numReviews,
            // adminId: admin?.id as number,
        };
        const created_product = await (0, product_repository_1.createProduct)(payload);
        console.log("Created product yes...", created_product);
        const { id, createdAt, updatedAt, ...others } = created_product.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Product created!.",
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
exports.addProduct = addProduct;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getProducts = async (req, res, next) => {
    try {
        const found_products = await (0, product_repository_1.foundProducts)();
        console.log("This are the found products....", found_products);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "All Products!.",
            data: found_products,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getProducts = getProducts;
// @route POST api/auth/login
// @desc Login into account
// @access Private//0009785185
const getProductsFilter = async (req, res, next) => {
    const { pageNum, pageSize, brand, size, price, categories, color, minPrice, maxPrice, } = req.query;
    // Define a function to calculate pagination
    const getPagination = (pageNumb, sizeNum) => {
        const pageNumber = pageNumb ? parseInt(pageNumb, 10) : 0;
        const pageSize = sizeNum ? parseInt(sizeNum, 10) : 5; // Default page size to 10 if not provided
        // Provide a default value of 10 if size is falsy
        const limit = pageSize ? +pageSize : 10; // Default limit to 10 if size is falsy
        const offset = pageNumber ? pageNumber * (limit !== null && limit !== void 0 ? limit : 0) : 0;
        // const offset = page ? page * limit : 0;
        return { limit, offset };
    };
    // Define a function to extract paging data
    const getPagingData = (data, page, limit) => {
        const { count: totalItems, rows: products } = data;
        const currentPage = page || 0;
        const totalPages = Math.ceil(totalItems / limit);
        return { totalItems, products, totalPages, currentPage };
    };
    // Construct the condition based on the query parameters
    let condition = {};
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
        const { limit, offset } = getPagination(pageNum, pageSize);
        const foundProducts = await (0, product_repository_1.foundProductsPag)(condition, limit, offset);
        console.log("This are the found products....", foundProducts);
        const productsData = getPagingData(foundProducts, Number(pageNum), limit);
        const { products, totalItems, totalPages, currentPage } = productsData;
        const productRecords = products.map((product) => {
            const { id, createdAt, updatedAt, ...others } = product.dataValues;
            return others;
        });
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Searched Products!.",
            data: {
                totalItems,
                productRecords,
                totalPages,
                currentPage,
            },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getProductsFilter = getProductsFilter;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getProduct = async (req, res, next) => {
    const { prod_id } = req.params;
    try {
        const found_product = await (0, product_repository_1.foundProductId)(prod_id);
        console.log("This are the found products....", found_product);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Product info!.",
            data: found_product,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getProduct = getProduct;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const editProduct = async (req, res, next) => {
    const { admin } = req.session;
    const { prod_id } = req.params;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    const { title, slug, color, categories, price, brand, countInStock, rating, desc, size, numReviews, } = req.body;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const found_product = await (0, product_repository_1.foundProductId)(prod_id);
        console.log("This is found product....", found_product);
        const images = req.files;
        console.log("this is the images array", images);
        const imagesPathArray = images.map((img) => {
            return img.path;
        });
        console.log("images url array ...", imagesPathArray);
        const payload = {
            title: title,
            slug: slug,
            images: imagesPathArray, // Assuming images is an array of strings
            color: color,
            categories: categories,
            price: parseFloat(price), // Convert price to number
            brand: brand,
            countInStock: parseInt(countInStock), // Convert countInStock to number
            rating: parseFloat(rating), // Convert rating to number
            desc: desc,
            size: size,
            numReviews: numReviews,
            // adminId: admin?.id as number,
        };
        const updated_product = await (0, product_repository_1.updateProductId)(prod_id, payload);
        console.log("Updated product yes...", updated_product);
        const { id, createdAt, updatedAt, ...others } = updated_product.dataValues;
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Product updated!.",
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
exports.editProduct = editProduct;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const deleteProduct = async (req, res, next) => {
    const { admin } = req.session;
    const { prod_id } = req.params;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        await (0, product_repository_1.deleteProductId)(prod_id);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Product deleted.",
            // data: { ...others },
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
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
