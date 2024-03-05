"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductId = exports.updateProductId = exports.createProduct = exports.foundProductTitle = exports.foundProductId = exports.foundProducts = void 0;
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
    if (data.colors !== undefined) {
        updated_product.colors = data.colors;
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
    if (data.sizes !== undefined) {
        updated_product.sizes = data.sizes;
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
// // Iterate over the properties of the data object
// for (const key in data) {
//   if (data.hasOwnProperty(key)) {
//     // Update only if the property is not undefined
//     if (data[key as keyof Product] !== undefined) {
//       updated_product[key as keyof Product] = data[key as keyof Product];
//     }
//   }
// }
// updated_product.title = data.title;
// updated_product.slug = data.slug;
// updated_product.images = data.images;
// updated_product.colors = data.colors;
// updated_product.categories = data.categories;
// updated_product.price = data.price;
// updated_product.brand = data.brand;
// updated_product.countInStock = data.countInStock;
// updated_product.rating = data.rating;
// updated_product.desc = data.desc;
// updated_product.sizes = data.sizes;
// updated_product.numReviews = data.numReviews;
// const found_product = await foundProductId(id);
// const deleted_product = await found_product.destroy();
// Iterate over the properties of the data object
// for (const key in data) {
//   if (data.hasOwnProperty(key)) {
//     // Update only if the property is not undefined
//     if (
//       data[key as keyof Product] !== undefined ||
//       !Number.isNaN(data[key as keyof Product])
//     ) {
//       updated_product[key as keyof Product] = data[key as keyof Product];
//     }
//   }
// }
