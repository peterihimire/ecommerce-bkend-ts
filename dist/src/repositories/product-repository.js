"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = exports.foundProductTitle = exports.foundProductId = void 0;
const models_1 = __importDefault(require("../database/models"));
const Product = models_1.default.Product;
const foundProductId = async (id) => {
    return Product.findOne({
        where: { uuid: id },
    });
};
exports.foundProductId = foundProductId;
const foundProductTitle = async (title) => {
    return Product.findOne({
        where: { title: title },
    });
};
exports.foundProductTitle = foundProductTitle;
const createProduct = async (data) => {
    return Product.create({
        title: data.title,
        slug: data.slug,
        images: data.images,
        colors: data.colors,
        categories: data.categories,
        price: data.price,
        brand: data.brand,
        countInStock: data.countInStock,
        rating: data.rating,
        desc: data.desc,
        sizes: data.sizes,
        numReviews: data.numReviews,
        // adminId: data.adminId,
    });
};
exports.createProduct = createProduct;
