"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductId = exports.updateProductId = exports.createProduct = exports.foundProductTitle = exports.foundProductId = exports.foundProductsPag = exports.foundProducts = void 0;
const models_1 = __importDefault(require("../database/models"));
const Product = models_1.default.Product;
const foundProducts = async () => {
    return Product.findAll({
        attributes: {
            exclude: ["id"],
        },
    });
};
exports.foundProducts = foundProducts;
const foundProductsPag = async (condition, limit, offset) => {
    const options = {
        where: condition,
        limit,
        offset,
    };
    return Product.findAndCountAll(options);
};
exports.foundProductsPag = foundProductsPag;
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
        color: data.color,
        categories: data.categories,
        price: data.price,
        brand: data.brand,
        countInStock: data.countInStock,
        rating: data.rating,
        desc: data.desc,
        size: data.size,
        numReviews: data.numReviews,
        // adminId: data.adminId,
    });
};
exports.createProduct = createProduct;
const updateProductId = async (id, data) => {
    console.log("This is data putu...", data);
    const updated_product = await (0, exports.foundProductId)(id);
    console.log("This is the update product...", updated_product);
    // Update the product fields if they are provided in the data
    if (data.title !== undefined) {
        updated_product.title = data.title;
    }
    if (data.slug !== undefined) {
        updated_product.slug = data.slug;
    }
    if (data.images !== undefined) {
        updated_product.images = data.images;
    }
    if (data.color !== undefined) {
        updated_product.color = data.color;
    }
    if (data.categories !== undefined) {
        updated_product.categories = data.categories;
    }
    if (!Number.isNaN(data.countInStock)) {
        updated_product.price = data.price;
    }
    if (data.brand !== undefined) {
        updated_product.brand = data.brand;
    }
    if (!Number.isNaN(data.countInStock)) {
        updated_product.countInStock = data.countInStock;
    }
    if (!Number.isNaN(data.countInStock)) {
        updated_product.rating = data.rating;
    }
    if (data.desc !== undefined) {
        updated_product.desc = data.desc;
    }
    if (data.size !== undefined) {
        updated_product.size = data.size;
    }
    if (data.numReviews !== undefined) {
        // Convert numReviews to a number if provided as a string
        // updated_product.numReviews = parseInt(data.numReviews);
        updated_product.numReviews = data.numReviews;
    }
    return updated_product.save();
};
exports.updateProductId = updateProductId;
const deleteProductId = async (id) => {
    const deleted_product = await Product.destroy({
        where: {
            uuid: id,
        },
    });
    return deleted_product;
};
exports.deleteProductId = deleteProductId;
