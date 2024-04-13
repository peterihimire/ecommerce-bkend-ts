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
const OrderProduct = db.OrderProduct;

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
import { addCartProds } from "../repositories/order-repository";

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

    const created_order = await Order.create({
      userId: existing_user.id,
      address: address,
      totalQty: cart?.totalQty,
      totalPrice: cart?.totalPrice,
    });
    console.log(
      "Created order, id and uuid...",
      created_order,
      created_order.id,
      created_order.uuid
    );
    const cart_prods = await foundCartId(existing_user.cart.id);
    console.log("This is cart_prods...", cart_prods);
    const products_arr = cart_prods.products.map((item: any) => {
      console.log("Single item..", item.cart_products);
      return {
        orderId: created_order?.id,
        prodId: item.cart_products.productId,
        uuid: created_order?.uuid,
        title: item.cart_products.title,
        price: item.cart_products.price,
        quantity: item.cart_products.quantity,
      };
    });

    console.log("Product arrays shit...", products_arr);

    const order_products = await addCartProds(products_arr);

    res.status(201).json({
      status: "Successful",
      msg: "Available Cart Order!",
      data: {
        order: created_order,
        products: order_products,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const getOrder: RequestHandler = async (req, res, next) => {
  const { user } = req?.session;
  const { order_id } = req?.body;

  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);
    const existing_order = await existing_user.getOrders({
      where: {
        uuid: order_id,
      },
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
            model: OrderProduct,
            as: "order_products", // Alias for the through model
            attributes: [
              "id",
              "quantity",
              "title",
              "price",
              // "orderId",
              // "productId",
            ],
          },
        },
      ],
    });
    console.log(
      "This is found user & order....",
      existing_user,
      existing_order
    );
    // console.log("cartId....", existing_user.order.id);
    if (!existing_order) {
      return next(
        new BaseError("Order does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Order info.",
      data: existing_order,
      // data: cart_response,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const getOrders: RequestHandler = async (req, res, next) => {
  const { user } = req?.session;
  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    const existing_user = await foundUser(email);
    const existing_orders = await existing_user.getOrders({
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
            model: OrderProduct,
            as: "order_products", // Alias for the through model
            attributes: ["id", "quantity", "title", "price"],
          },
        },
      ],
    });
    console.log(
      "This is found user & order....",
      existing_user,
      existing_orders
    );
    // console.log("cartId....", existing_user.order.id);
    if (!existing_orders) {
      return next(
        new BaseError("Order does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Order info.",
      data: existing_orders,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const cancelOrder: RequestHandler = async (req, res, next) => {
  const { user } = req?.session;
  const { order_id } = req.body;
  const status = "cancelled";
  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);
    const existing_order = await existing_user.getOrders({
      where: {
        uuid: order_id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          attributes: {
            exclude: [
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
            attributes: ["quantity", "title", "price", "orderId", "productId"],
          },
        },
      ],
    });
    console.log("This is found user & order....", existing_order);
    if (!existing_order) {
      return next(
        new BaseError("Order does not exist!", httpStatusCodes.CONFLICT)
      );
    }

    if ((existing_order[0].status = status)) {
      return next(
        new BaseError("Order already cancelled!", httpStatusCodes.CONFLICT)
      );
    }

    const updated_order = await existing_order[0];
    console.log("Updated order yesh", updated_order);
    updated_order.status = status;
    await updated_order.save();

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: `Order with id ${order_id} canceled.`,
      data: updated_order,
    });
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};
