"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProduct = void 0;
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
    const { title, slug, images, colors, categories, price, brand, countInStock, rating, desc, sizes, numReviews, } = req.body;
    console.log("thia is ...", Product);
    try {
        const found_admin = await (0, admin_auth_repository_1.foundAdmin)(email);
        if (!found_admin) {
            return next(new base_error_1.default("Admin does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        console.log("This is ...", Product);
        const found_product = await (0, product_repository_1.foundProductTitle)(title);
        console.log("This is found product....", found_product);
        // if (found_product) {
        //   return next(
        //     new BaseError("Product title already exist.", httpStatusCodes.CONFLICT)
        //   );
        // }
        const payload = {
            title: title,
            slug: slug,
            images: images,
            colors: colors,
            categories: categories,
            price: parseFloat(price),
            brand: brand,
            countInStock: parseInt(countInStock),
            rating: parseFloat(rating),
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
