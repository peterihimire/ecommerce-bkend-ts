"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adddCart = exports.updateCartProduct = exports.getCart = exports.addCart = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = models_1.default.User;
const Cart = models_1.default.Cart;
const Product = models_1.default.Product;
const CartProduct = models_1.default.CartProduct;
const uuid_1 = require("uuid");
const product_repository_1 = require("../repositories/product-repository");
const user_repository_1 = require("../repositories/user-repository");
const cart_repository_1 = require("../repositories/cart-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addCart = async (req, res, next) => {
    var _a, _b, _c;
    const { prod_id } = req.body;
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        let newCart;
        const newQty = 1;
        const sessionUser = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
        let sessionCart = (_b = req.session) === null || _b === void 0 ? void 0 : _b.cart;
        // const sessionUser = req.session?.user as SessionUser;
        // let sessionCart = req.session?.cart as SessionCart;
        // If user is unauthenticated
        if (!sessionUser) {
            if (!sessionCart) {
                // If no cart data in session, initialize it
                sessionCart = {
                    userId: (0, uuid_1.v4)(),
                    cartId: (0, uuid_1.v4)(), // Generate a new UUID for unauthenticated user's cart
                    products: [],
                    totalQty: 0,
                    totalPrice: 0,
                };
                req.session.cart = sessionCart;
            }
            const productId = req.body.prod_id;
            // const product = await Product.findByPk(productId);
            const prod_info = await (0, product_repository_1.foundProductId)(prod_id);
            if (!prod_info) {
                return next(new base_error_1.default(`Product does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
            }
            const productIndex = sessionCart.products.findIndex((product) => {
                return product.productId === productId;
            });
            if (productIndex !== -1) {
                // If product already exists in cart, increment quantity
                sessionCart.products[productIndex].quantity += newQty;
            }
            else {
                // If product doesn't exist in cart, add it
                sessionCart.products.push({
                    productId,
                    name: prod_info.title,
                    price: prod_info.price,
                    quantity: newQty,
                });
            }
            // Update total cart price and quantity
            sessionCart.totalPrice = sessionCart.products.reduce((total, item) => {
                return total + Number(item.price) * item.quantity;
            }, 0);
            sessionCart.totalQty = sessionCart.products.reduce((total, item) => {
                return total + item.quantity;
            }, 0);
            req.session.cart = sessionCart;
            // Prepare response data
            newCart = {
                cartId: sessionCart.cartId,
                productId,
                uuid: (0, uuid_1.v4)(), // Generate a new UUID for cart product
                addedBy: "Unauthenticated User", // Placeholder value
                addedAt: new Date(), // Current date and time
                quantity: newQty,
                title: prod_info.title,
                price: prod_info.price,
            };
            return res.status(200).json({
                status: "success",
                msg: "Added to cart session",
                data: newCart,
            });
        }
        // If user is authenticated
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
        console.log("Existing baba user...", existing_user);
        let cart = await (0, cart_repository_1.foundUserCartId)(existing_user.id);
        console.log("My cart...", cart);
        // console.log("My cart. products. .", cart.products);
        if (!cart) {
            // If user doesn't have a cart, create one
            cart = await Cart.create({ userId: existing_user.id });
        }
        const productId = req.body.prod_id;
        // const product = await Product.findByPk(productId);
        const prod_info = await (0, product_repository_1.foundProductId)(prod_id);
        console.log("Prod_Info...", prod_info);
        const existingCartProd = (_c = cart === null || cart === void 0 ? void 0 : cart.products) === null || _c === void 0 ? void 0 : _c.find((item) => item.uuid === prod_id);
        console.log("Existing cart product...", existingCartProd);
        console.log("Existing cart product datavalues...", existingCartProd === null || existingCartProd === void 0 ? void 0 : existingCartProd.cart_products.dataValues);
        // const cart = await Cart.findByPk(cartId, { include: Product });
        let cartProduct = await CartProduct.findOne({
            where: {
                cartId: cart.id,
                productId: prod_info.id,
            },
        });
        if (cartProduct) {
            // If product already exists in cart, update quantity
            cartProduct.quantity += newQty;
            await cartProduct.save();
        }
        else {
            // If product doesn't exist in cart, add it
            cartProduct = await CartProduct.create({
                cartId: cart.id,
                productId: prod_info.id,
                quantity: newQty,
                addedBy: email,
                uuid: (0, uuid_1.v4)(),
                addedAt: new Date(),
                title: prod_info.title,
                price: prod_info.price,
            });
        }
        res.status(200).json({
            status: "success",
            msg: "Added to cart",
            data: cartProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.addCart = addCart;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getCart = async (req, res, next) => {
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
        const existing_cart = await existing_user.getCart();
        console.log("This is found user & cart....", existing_user, existing_cart);
        console.log("cartId....", existing_user.cart.id);
        if (!existing_cart) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const cart_prods = await (0, cart_repository_1.foundCartId)(existing_user.cart.id);
        const totalCartPrice = cart_prods.products.reduce((total, item) => {
            return (total + Number(item.cart_products.price) * item.cart_products.quantity);
        }, 0);
        const totalCartQty = cart_prods.products.reduce((total, item) => {
            console.log("itme....", item.cart_products.quantity);
            return total + item.cart_products.quantity;
        }, 0);
        console.log("TOTAL QTY:", totalCartQty);
        const products_arr = cart_prods.products.map((item) => {
            return {
                prod_uuid: item.uuid,
                title: item.cart_products.title,
                price: item.cart_products.price,
                quantity: item.cart_products.quantity,
            };
        });
        const cart_response = {
            cart_uuid: cart_prods.uuid,
            products: products_arr,
            total_qty: totalCartQty,
            total_price: totalCartPrice,
        };
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Cart info.",
            data: cart_response,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getCart = getCart;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const updateCartProduct = async (req, res, next) => {
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const { type } = req.body;
    const { prod_id } = req.params;
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        let updatedQty;
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
        const existing_cart = await existing_user.getCart();
        console.log("This is found user & cart....", existing_user, existing_cart);
        console.log("cartId....", existing_user.cart.id);
        if (!existing_cart) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const cart_info = await (0, cart_repository_1.foundCartId)(existing_user.cart.id);
        const totalCartPrice = cart_info.products.reduce((total, item) => {
            return (total + Number(item.cart_products.price) * item.cart_products.quantity);
        }, 0);
        const totalCartQty = cart_info.products.reduce((total, item) => {
            console.log("itme....", item.cart_products.quantity);
            return total + item.cart_products.quantity;
        }, 0);
        console.log("TOTAL QTY:", totalCartQty);
        const products_arr = cart_info.products.map((item) => {
            return {
                prod_uuid: item.uuid,
                title: item.cart_products.title,
                price: item.cart_products.price,
                quantity: item.cart_products.quantity,
            };
        });
        const cart_response = {
            cart_uuid: cart_info.uuid,
            products: products_arr,
            total_qty: totalCartQty,
            total_price: totalCartPrice,
        };
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Cart info.",
            data: cart_response,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.updateCartProduct = updateCartProduct;
// interface SessionUser {
//   id: string;
// }
// interface SessionCart {
//   userId: string | null;
//   cartId: string;
//   products: {
//     productId: string;
//     name: string;
//     price: number;
//     quantity: number;
//   }[];
//   totalQty: number;
//   totalPrice: number;
// }
// {
//   // where: { id: prod_info.id },
//   // through: { attributes: ["quantity", "addedBy", "addedAt", "uuid"] }, // Include additional fields her
// }
// @route POST api/auth/login
// @desc Login into account
// @access Private
const adddCart = async (req, res, next) => {
    var _a;
    const { prod_id } = req.body;
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    let fetched_cart;
    let new_qty = 1;
    try {
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
        const existing_cart = await existing_user.getCart();
        console.log("This is found user & cart....", existing_user, existing_cart);
        if (!existing_cart) {
            const new_cart = await existing_user.createCart();
            fetched_cart = new_cart;
        }
        else {
            fetched_cart = existing_cart;
        }
        const prod_info = await (0, product_repository_1.foundProductId)(prod_id);
        if (!prod_info) {
            return next(new base_error_1.default(`Product does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
        }
        console.log("Prod info...", prod_info);
        console.log("Prod info id...", prod_info.id);
        const existing_product = await fetched_cart.getProducts({
            where: { id: prod_info.id },
            through: { attributes: ["quantity", "addedBy", "addedAt", "uuid"] }, // Include additional fields her
        });
        console.log("Existing product...", existing_product[0].cart_products);
        if (existing_product === null || existing_product === void 0 ? void 0 : existing_product.length) {
            // new_qty = (await existing_product[0].cart_products?.quantity) + 1;
            const quantity = ((_a = existing_product[0].cart_products) === null || _a === void 0 ? void 0 : _a.quantity) || 0; // Default to 0 if quantity is undefined
            new_qty = quantity + 1;
        }
        console.log("Quantity...", new_qty);
        const new_cart = await fetched_cart.addProduct(prod_info, {
            through: {
                quantity: new_qty,
                addedBy: existing_user === null || existing_user === void 0 ? void 0 : existing_user.email,
            },
        });
        console.log("New cart...", new_cart);
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Product added to cart.",
            data: new_cart,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.adddCart = adddCart;
