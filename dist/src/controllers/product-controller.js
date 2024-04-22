"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.editProduct = exports.getProduct = exports.getProducts = exports.addProduct = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Product = models_1.default.Product;
const product_repository_1 = require("../repositories/product-repository");
const admin_auth_repository_1 = require("../repositories/admin-auth-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addProduct = async (req, res, next) => {
    const { admin } = req.session;
    const email = admin === null || admin === void 0 ? void 0 : admin.email;
    const { title, slug, colors, categories, price, brand, countInStock, rating, desc, sizes, numReviews, } = req.body;
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
            colors: colors,
            categories: categories,
            price: parseFloat(price), // Convert price to number
            brand: brand,
            countInStock: parseInt(countInStock), // Convert countInStock to number
            rating: parseFloat(rating), // Convert rating to number
            desc: desc,
            sizes: sizes,
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
    const { title, slug, images, colors, categories, price, brand, countInStock, rating, desc, sizes, numReviews, } = req.body;
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const found_product = await (0, product_repository_1.foundProductId)(prod_id);
        console.log("This is found product....", found_product);
        const payload = {
            title: title,
            slug: slug,
            images: images, // Assuming images is an array of strings
            colors: colors,
            categories: categories,
            price: parseFloat(price), // Convert price to number
            brand: brand,
            countInStock: parseInt(countInStock), // Convert countInStock to number
            rating: parseFloat(rating), // Convert rating to number
            desc: desc,
            sizes: sizes,
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
