"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCart = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = models_1.default.User;
const product_repository_1 = require("../repositories/product-repository");
const user_repository_1 = require("../repositories/user-repository");
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addCart = async (req, res, next) => {
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
        console.log("Prod info...", prod_info);
        console.log("Prod info id...", prod_info.id);
        if (!prod_info) {
            return next(new base_error_1.default(`Product does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
        }
        const existing_product = await fetched_cart.getProducts({
            where: { id: prod_info.id },
        });
        console.log("Existing product...", existing_product);
        if (existing_product === null || existing_product === void 0 ? void 0 : existing_product.length) {
            // new_qty = (await existing_product[0].cart_products?.quantity) + 1;
            const quantity = ((_a = existing_product[0].cart_products) === null || _a === void 0 ? void 0 : _a.quantity) || 0; // Default to 0 if quantity is undefined
            new_qty = quantity + 1;
        }
        console.log("Quantity...", new_qty);
        const new_cart = await fetched_cart.addProduct(prod_info, {
            through: {
                quantity: new_qty,
                addedBy: existing_user === null || existing_user === void 0 ? void 0 : existing_user.uuid,
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
exports.addCart = addCart;
