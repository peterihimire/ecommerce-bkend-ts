"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToCart = exports.foundCart = void 0;
const models_1 = __importDefault(require("../database/models"));
const Cart = models_1.default.Cart;
const foundCart = async (id) => {
    return Cart.findOne({
        where: { uuid: id },
    });
};
exports.foundCart = foundCart;
const addToCart = async () => {
    return Cart.findOne({
    // where: { uuid: id },
    });
};
exports.addToCart = addToCart;
