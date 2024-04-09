import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import dotenv from "dotenv";

dotenv.config();
const User = db.User;
const Cart = db.Cart;
const Order = db.Order;
const Product = db.Product;
const CartProduct = db.CartProduct;

import { v4 as uuidv4 } from "uuid";
import { foundProductId } from "../repositories/product-repository";
import { foundUser } from "../repositories/user-repository";
import {
  foundCart,
  addToCart,
  foundCartId,
  foundUserCart,
  foundUserCartId,
  foundCartProd,
  addCartProd,
  removeCartProd,
} from "../repositories/cart-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const addOrder: RequestHandler = async (req, res, next) => {
  const { address } = req.body;
  const { user } = req?.session;
  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);

    console.log("Existing baba user...", existing_user);

    let cart = await foundUserCartId(existing_user.id);

    console.log("My cart...", cart);
    // console.log("My cart. products. .", cart.products);
    if (!cart) {
      return next(
        new BaseError("Cart not available!", httpStatusCodes.NOT_FOUND)
      );
    }

    const cart_prods = await foundCartId(existing_user.cart.id);
    const products_arr = cart_prods.products.map((item: any) => {
      return {
        prod_uuid: item.uuid,
        title: item.cart_products.title,
        price: item.cart_products.price,
        quantity: item.cart_products.quantity,
      };
    });

    const created_order = Order.create({
      userId: existing_user.id,
      address: address,
      totalQty: cart?.totalQty,
      totalPrice: cart?.totalPrice,
    });

    const newOrder = await created_order.addProducts(products_arr);

    res.status(201).json({
      status: "Successful",
      msg: "Available Cart Order!",
      data: newOrder,
    });
  } catch (error) {
    next(error);
  }
};
// const existingCartProds = cart?.products;
// console.log("Existing cart product...", existingCartProds);
// console.log(
//   "Existing cart product datavalues...",
//   existingCartProds?.cart_products.dataValues
// );
