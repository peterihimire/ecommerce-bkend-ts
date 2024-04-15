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

const pdfMakeX = require("pdfmake/build/pdfmake.js");
const pdfFontsX = require("pdfmake-unicode/dist/pdfmake-unicode.js");
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;
import * as pdfMake from "pdfmake/build/pdfmake";
import { Content, ContentColumns, ContentStack } from "pdfmake/interfaces";
import { createWriteStream } from "fs";

// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
// import { generatePDFFile } from "../utils/pdf-generator";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// // Type assertion to let TypeScript know that pdfMake has a vfs property
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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

    // const file = await generatePDFFile("invoice", created_order);
    // console.log("This is the file content...", file);
    const docDefinition = {
      content: [
        {
          columns: [
            {
              image:
                "data:image/png;base64,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",
              width: 80,
            },

            {
              fontSize: 12,
              text: [
                {
                  text: "For Support and Enquires\n",
                  bold: true,
                  fontSize: 15,
                },
                {
                  text: "0700225569684 \n SMS: 09064579779\n WhatsApp: 09097807503",
                },
              ],
              alignment: "right",
            },
          ],
        },
        {
          table: {
            widths: ["*", "*", "*"],
            headerRows: 1,
            body: [
              [
                {
                  text: "",
                  fillColor: "000",
                  style: "tableHeader",
                  bold: true,
                },
                { text: "", fillColor: "#000" },
                { text: "", fillColor: "#000" },
              ],
            ],
          },
          // layout: 'headerLineOnly',
          margin: [0, 20],
        },
        //   {
        //     text: "PAYMENT INVOICE",
        //     bold: true,
        //     fontSize: 20,
        //     margin: [15, 30, 0, 15],
        //   },
        {
          table: {
            widths: [40, "*", "*", "*"],
            body: [
              [
                { text: `Bill to:`, alignment: "left", bold: true },
                "Peter Ihimire",
                { text: `Order id:`, alignment: "right", bold: true },
                { text: `849494003`, alignment: "right" },
              ],
              [
                ``,
                `${user?.email}`,
                { text: `Order date:`, alignment: "right", bold: true },
                { text: `22-02-2003`, alignment: "right" },
              ],
              [
                ``,
                `${address}`,
                { text: `Due date:`, alignment: "right", bold: true },
                { text: `93903848849`, alignment: "right" },
              ],
              // [``, "", "",""],
            ],
          },
          layout: "noBorders",
          margin: [0, 0, 0, 20],
        },
        {
          style: "tableExample",
          table: {
            widths: [200, "*", "*", "*"],
            headerRows: 1,
            body: [
              [
                {
                  text: "Description",
                  // fillColor: "#46C35F",
                  color: "#000",
                  bold: true,
                  fontSize: 12,
                  margin: [15, 5],
                },
                {
                  text: "Quantity",
                  // fillColor: "#46C35F",
                  color: "#000",
                  bold: true,
                  fontSize: 12,
                  margin: [15, 5],
                },
                {
                  text: "Price",
                  // fillColor: "#46C35F",
                  color: "#000",
                  bold: true,
                  fontSize: 12,
                  alignment: "right",
                  margin: [15, 5],
                },
                {
                  text: "Amount",
                  // fillColor: "#46C35F",
                  color: "#000",
                  bold: true,
                  fontSize: 12,
                  alignment: "right",
                  margin: [15, 5],
                },
              ],
              ...order_products.map((prod) => [
                {
                  text: `${prod?.title}`,
                  margin: [15, 10],
                  fontSize: 12,
                },
                { text: `${prod?.quantity}`, margin: [15, 10] },
                {
                  text: `₦${prod?.price}`,
                  alignment: "right",
                  margin: [15, 10],
                  fontSize: 12,
                },
                {
                  text: `₦${prod?.price * prod?.quantity}`,
                  alignment: "right",
                  fontSize: 12,
                  margin: [15, 10],
                },
              ]),
            ],
          },
          layout: "borders",
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            widths: [280, "*", "*"],
            headerRows: 1,
            body: [
              [
                "",
                {
                  text: "TOTAL",
                  // fillColor: "#46C35F",
                  color: "#000",
                  fontSize: 14,
                  margin: [10, 5],
                },
                {
                  text: `${created_order?.totalPrice}`,
                  alignment: "right",
                  color: "#000",
                  // fillColor: "#46C35F",
                  fontSize: 14,
                  margin: [15, 5],
                },
              ],
            ],
          },
          // layout: "noBorders",
          layout: "borders",
          margin: [0, 0, 0, 20],
        },

        {
          text: "Terms and conditions",
          bold: true,
          margin: [15, 50, 0, 15],
        },

        {
          text: "Every time you select a line of text, the utility will bring up a small menu with suggested actions like copy and paste, as well as translation, spell check, word count, and more useful stuff! Once you give it a go, PopClip will likely become your most-used and most-loved instant text helper.",
          margin: [15, 0, 0, 0],
        },
        {
          // image: paymentImage,
          // width: 100,
          // margin: [15, 0, 0, 0],
          // alignment: "right",
        },
      ],
      styles: {
        header: {
          bold: true,
          fontSize: 16,
          margin: [0, 25, 0, 10],
        },
        text: {
          fontSize: 12,
          margin: [15, 2, 0, 0],
        },
      },
    } as { content: (Content | ContentColumns | ContentStack)[]; styles: any };

    // Create and open the PDF
    // const pdfDocGenerator = pdfMake.createPdf(docDefinition).open();
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    
    // Generate and download the PDF
    pdfDocGenerator.getBuffer((buffer) => {
      // Save the buffer to a file
      const filePath = `documents/pdf/invoice-${new Date().toISOString()}.pdf`;
      const stream = createWriteStream(filePath);
      stream.write(Buffer.from(buffer));
      stream.end();

      console.log(`PDF saved to: ${filePath}`);
    });

    pdfDocGenerator.download("pdfmake.pdf");

    // pdfDocGenerator.getDataUrl((dataurl) => {
    //   console.log("This is dataurl", dataurl);
    //   console.log(
    //     "This is doc definition stringified",
    //     JSON.stringify(docDefinition)
    //   );
    // });
    // pdfDocGenerator.open();
    // pdfDocGenerator.print();
    // console.log("PDF doc generator...", pdfDocGenerator);

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
// pdfDocGenerator.getBase64((dataUrl) => {
//   res.writeHead(200, {
//     "Content-Type": "application/pdf",
//     "Content-Disposition": `attachment;filename=invoice.pdf`,
//   });

//   const download = Buffer.from(dataUrl.split("base64,")[1], "base64");
//   console.log("This is download...",download)
//   res.end(download);
// });
