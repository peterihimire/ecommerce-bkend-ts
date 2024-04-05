import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import db from "../database/models";
import dotenv from "dotenv";

dotenv.config();
const User = db.User;
const Cart = db.Cart;
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
} from "../repositories/cart-repository";

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const addCart: RequestHandler = async (req, res, next) => {
  const { prod_id } = req.body;
  const { user } = req?.session;
  const email: string | undefined = user?.email;
  try {
    let newCart: {
      cartId: string;
      productId: string;
      uuid: string;
      addedBy: string;
      addedAt: Date;
      quantity: number;
      title: string;
      price: number;
    };
    const newQty = 1;
    const sessionUser = req.session?.user;
    let sessionCart = req.session?.cart;
    // const sessionUser = req.session?.user as SessionUser;
    // let sessionCart = req.session?.cart as SessionCart;

    // If user is unauthenticated
    if (!sessionUser) {
      if (!sessionCart) {
        // If no cart data in session, initialize it
        sessionCart = {
          userId: uuidv4(),
          cartId: uuidv4(), // Generate a new UUID for unauthenticated user's cart
          products: [],
          totalQty: 0,
          totalPrice: 0,
        };
        req.session.cart = sessionCart;
      }

      const productId = req.body.prod_id;
      // const product = await Product.findByPk(productId);

      const prod_info = await foundProductId(prod_id);

      if (!prod_info) {
        return next(
          new BaseError(`Product does not exist.`, httpStatusCodes.NOT_FOUND)
        );
      }

      const productIndex = sessionCart.products.findIndex((product) => {
        return product.productId === productId;
      });

      if (productIndex !== -1) {
        // If product already exists in cart, increment quantity
        sessionCart.products[productIndex].quantity += newQty;
      } else {
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
        uuid: uuidv4(), // Generate a new UUID for cart product
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
      // If user doesn't have a cart, create one
      cart = await Cart.create({ userId: existing_user.id });
    }

    const productId = req.body.prod_id;
    // const product = await Product.findByPk(productId);
    const prod_info = await foundProductId(prod_id);
    console.log("Prod_Info...", prod_info);

    const existingCartProd = cart?.products?.find(
      (item: any) => item.uuid === prod_id
    );
    console.log("Existing cart product...", existingCartProd);
    console.log(
      "Existing cart product datavalues...",
      existingCartProd?.cart_products.dataValues
    );

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
    } else {
      // If product doesn't exist in cart, add it
      cartProduct = await CartProduct.create({
        cartId: cart.id,
        productId: prod_info.id,
        quantity: newQty,
        addedBy: email,
        uuid: uuidv4(),
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
  } catch (error) {
    next(error);
  }
};

// @route POST api/auth/login
// @desc Login into account
// @access Private
export const getCart: RequestHandler = async (req, res, next) => {
  const { user } = req?.session;
  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);
    const existing_cart = await existing_user.getCart();
    console.log("This is found user & cart....", existing_user, existing_cart);
    console.log("cartId....", existing_user.cart.id);
    if (!existing_cart) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const cart_prods = await foundCartId(existing_user.cart.id);

    const totalCartPrice = cart_prods.products.reduce(
      (total: any, item: any) => {
        return (
          total + Number(item.cart_products.price) * item.cart_products.quantity
        );
      },
      0
    );

    const totalCartQty = cart_prods.products.reduce((total: any, item: any) => {
      console.log("itme....", item.cart_products.quantity);
      return total + item.cart_products.quantity;
    }, 0);
    console.log("TOTAL QTY:", totalCartQty);

    const products_arr = cart_prods.products.map((item: any) => {
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

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Cart info.",
      data: cart_response,
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
export const updateProductQty: RequestHandler = async (req, res, next) => {
  const { user } = req?.session;
  const { type, prod_id } = req.body;
  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);
    const existing_cart = await existing_user.getCart();
    console.log("This is found user & cart....", existing_user, existing_cart);
    console.log("cartId....", existing_user.cart.id);
    if (!existing_cart) {
      return next(new BaseError("Cart not found!", httpStatusCodes.CONFLICT));
    }

    let cart = await foundUserCartId(existing_user.id);

    const prod_info = await foundProductId(prod_id);
    // let cartProduct = await CartProduct.findOne({
    //   where: {
    //     cartId: cart.id,
    //     productId: prod_info.id,
    //   },
    // });

    let cartProduct = await foundCartProd(cart.id, prod_info.id);

    if (!cartProduct) {
      return next(
        new BaseError(`Product not found in cart.`, httpStatusCodes.NOT_FOUND)
      );
    }

    console.log("This is cart product...", cartProduct);

    if (cartProduct && type) {
      cartProduct.quantity += type;
      await cartProduct.save();
    }

    if (cartProduct?.quantity === 0) {
      await CartProduct.destroy({
        where: {
          cartId: cart.id,
          productId: prod_info.id,
        },
      });

      return res.status(httpStatusCodes.OK).json({
        status: "success",
        msg: `Product ${prod_info?.title} removed from cart.`,
      });
    }

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Cart product updated.",
      data: cartProduct,
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
export const deleteCartProd: RequestHandler = async (req, res, next) => {
  const { user } = req?.session;
  const { prod_id } = req.body;
  const email: string | undefined = user?.email;

  try {
    if (email === undefined) {
      return next(
        new BaseError("Account does not exist!", httpStatusCodes.CONFLICT)
      );
    }
    const existing_user = await foundUser(email);
    const existing_cart = await existing_user.getCart();
    console.log("This is found user & cart....", existing_user, existing_cart);
    console.log("cartId....", existing_user.cart.id);
    if (!existing_cart) {
      return next(new BaseError("Cart not found!", httpStatusCodes.CONFLICT));
    }

    let cart = await foundUserCartId(existing_user.id);

    const prod_info = await foundProductId(prod_id);
    let cartProduct = await CartProduct.findOne({
      where: {
        cartId: cart.id,
        productId: prod_info.id,
      },
    });

    if (!cartProduct) {
      return next(
        new BaseError(`Product not found in cart.`, httpStatusCodes.NOT_FOUND)
      );
    }

    console.log("This is cart product...", cartProduct);

    await CartProduct.destroy({
      where: {
        cartId: cart.id,
        productId: prod_info.id,
      },
    });

    res.status(httpStatusCodes.OK).json({
      status: "success",
      msg: "Cart product deleted.",
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
export const adddCart: RequestHandler = async (req, res, next) => {
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

    if (!prod_info) {
      return next(
        new BaseError(`Product does not exist.`, httpStatusCodes.NOT_FOUND)
      );
    }
    console.log("Prod info...", prod_info);
    console.log("Prod info id...", prod_info.id);

    const existing_product = await fetched_cart.getProducts({
      where: { id: prod_info.id },
      through: { attributes: ["quantity", "addedBy", "addedAt", "uuid"] }, // Include additional fields her
    });
    console.log("Existing product...", existing_product[0].cart_products);

    if (existing_product?.length) {
      // new_qty = (await existing_product[0].cart_products?.quantity) + 1;
      const quantity = existing_product[0].cart_products?.quantity || 0; // Default to 0 if quantity is undefined
      new_qty = quantity + 1;
    }
    console.log("Quantity...", new_qty);
    const new_cart = await fetched_cart.addProduct(prod_info, {
      through: {
        quantity: new_qty,
        addedBy: existing_user?.email,
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
