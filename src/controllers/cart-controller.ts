import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
// import bcrypt from "bcryptjs";
// import { default as bcrypt } from "bcryptjs";
import bcrypt from "bcrypt";
import randomString from "../utils/acc-generator";
import { NUMLIST } from "../utils/list-data";
import { sign, verify } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const User = db.User;
import { foundCart, addToCart } from "../repositories/cart-repository";
import { foundProductId } from "../repositories/product-repository";
import { foundUser } from "../repositories/user-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const addCart: RequestHandler = async (req, res, next) => {
  const { prod_id } = req.body;
  const { user } = req?.session;
  const email: string | undefined = user?.email;

  let fetched_cart;
  let new_qty = 1;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);
    const existing_cart = await existing_user.getCart();
    console.log("This is found user & cart....", existing_user, existing_cart);
    if (!existing_cart) {
      const new_cart = await existing_user.createCart();
      fetched_cart = new_cart;
    } else {
      fetched_cart = existing_cart;
    }

    const prod_info = await foundProductId(prod_id);
    console.log("Prod info...", prod_info);
    console.log("Prod info id...", prod_info.id);

    if (!prod_info) {
      return next(
        new BaseError(`Product does not exist.`, httpStatusCodes.NOT_FOUND)
      );
    }

    const existing_product = await fetched_cart.getProducts({
      where: { id: prod_info.id },
    });
    console.log("Existing product...", existing_product);

    if (existing_product?.length) {
      // new_qty = (await existing_product[0].cart_products?.quantity) + 1;
      const quantity = existing_product[0].cart_products?.quantity || 0; // Default to 0 if quantity is undefined
      new_qty = quantity + 1;
    }
    console.log("Quantity...", new_qty);
    const new_cart = await fetched_cart.addProduct(prod_info, {
      through: {
        quantity: new_qty,
        addedBy: existing_user?.uuid,
      },
    });

    console.log("New cart...", new_cart);

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Product added to cart.",
      data: new_cart,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
