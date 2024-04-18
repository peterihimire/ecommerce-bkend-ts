"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.existingAcctId = exports.foundUser = void 0;
const models_1 = __importDefault(require("../database/models"));
const User = models_1.default.User;
const Profile = models_1.default.Profile;
const Product = models_1.default.Product;
const Cart = models_1.default.Cart;
const Order = models_1.default.Order;
const CartProduct = models_1.default.CartProduct;
const OrderProduct = models_1.default.OrderProduct;
const foundUser = async (email) => {
    return User.findOne({
        where: { email: email },
        include: [
            {
                attributes: {
                    exclude: ["id", "createdAt", "updatedAt", "userId"],
                },
                model: Profile,
                as: "profile",
            },
            {
                attributes: {
                    exclude: ["createdAt", "updatedAt", "userId"],
                },
                model: Cart,
                as: "cart",
                include: [
                    {
                        // attributes: { exclude: ["id", "createdAt", "updatedAt"] },
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
                            as: "cart_products", // Alias for the through model
                            attributes: ["id", "quantity", "title", "price"], // Include additional attributes from CartProduct
                        },
                    },
                ],
            },
            {
                attributes: {
                    exclude: ["createdAt", "updatedAt", "userId"],
                },
                model: Order,
                as: "orders",
                include: [
                    {
                        // attributes: { exclude: ["createdAt", "updatedAt"] },
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
                            model: OrderProduct,
                            as: "order_products", // Alias for the through model
                            attributes: ["id", "quantity", "title", "price"], // Include additional attributes from CartProduct
                        },
                        // through: {
                        //   attributes: [],
                        // },
                    },
                ],
            },
        ],
    });
};
exports.foundUser = foundUser;
const existingAcctId = async (acct_id) => {
    return User.findOne({
        where: { acct_id: acct_id },
    });
};
exports.existingAcctId = existingAcctId;
const createUser = async (data) => {
    return User.create({
        email: data.email,
        password: data.password,
        acct_id: data.acct_id,
    });
};
exports.createUser = createUser;
// export const createProfile = async (data: {
//   // first_name: string;
//   // last_name: string;
//   acct_id: string;
//   userId: number;
// }) => {
//   return Profile.create({
//     // first_name: data.first_name,
//     // last_name: data.last_name,
//     acct_id: data.acct_id,
//     userId: data.userId,
//   });
// };
// module.exports = {
//   foundUser,
//   existingAcctId,
//   createUser,
//   createProfile,
// };
