"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = exports.foundUserCart = exports.foundUserCartId = exports.foundCart = exports.foundCartId = void 0;
const models_1 = __importDefault(require("../database/models"));
const Cart = models_1.default.Cart;
const Product = models_1.default.Product;
const CartProduct = models_1.default.CartProduct;
const foundCartId = async (id) => {
    return Cart.findOne({
        where: { id: id },
        attributes: {
            exclude: ["id", "createdAt", "updatedAt", "userId"],
        },
        include: [
            {
                attributes: {
                    exclude: [
                        "id",
                        "createdAt",
                        "updatedAt",
                        "colors",
                        "categories",
                        "brand",
                        "countInStock",
                        "rating",
                        "desc",
                        "sizes",
                        "numReviews",
                        "images",
                        "slug",
                        "price",
                        "title",
                    ],
                },
                model: Product,
                as: "products",
                through: {
                    model: CartProduct,
                    as: "cart_products",
                    attributes: ["quantity", "title", "price"], // Include additional attributes from CartProduct
                },
            },
        ],
    });
};
exports.foundCartId = foundCartId;
const foundCart = async (id) => {
    return Cart.findOne({
        where: { uuid: id },
        include: [
            {
                attributes: { exclude: ["createdAt", "updatedAt"] },
                model: Product,
                as: "products",
            },
        ],
    });
};
exports.foundCart = foundCart;
const foundUserCartId = async (id) => {
    return Cart.findOne({
        where: { userId: id },
        include: [
            {
                attributes: { exclude: ["createdAt", "updatedAt"] },
                model: Product,
                as: "products",
            },
        ],
    });
};
exports.foundUserCartId = foundUserCartId;
const foundUserCart = async (id) => {
    return Cart.findOne({
        where: { uuid: id },
        include: [
            {
                attributes: { exclude: ["createdAt", "updatedAt"] },
                model: Product,
                as: "products",
            },
        ],
    });
};
exports.foundUserCart = foundUserCart;
const addToCart = async () => {
    return Cart.findOne({
    // where: { uuid: id },
    });
};
exports.addToCart = addToCart;
// include: [
//   {
//     model: CartProduct,
//     as: "cartProducts", // Alias for the association
//     include: [
//       {
//         model: Product, // Assuming Product is imported
//         as: "product", // Alias for the association
//       },
//     ],
//   },
// ],
