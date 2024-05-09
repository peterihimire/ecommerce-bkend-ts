"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.getOrders = exports.getOrder = exports.addOrder = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const models_1 = __importDefault(require("../database/models"));
const stripe_1 = __importDefault(require("stripe"));
const sendinblue_api = require("sib-api-v3-sdk");
const SibApiV3Sdk = require("sib-api-v3-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const User = models_1.default.User;
const Cart = models_1.default.Cart;
const Order = models_1.default.Order;
const Product = models_1.default.Product;
const OrderProduct = models_1.default.OrderProduct;
const user_repository_1 = require("../repositories/user-repository");
const cart_repository_1 = require("../repositories/cart-repository");
const order_repository_1 = require("../repositories/order-repository");
const pdfMakeX = require("pdfmake/build/pdfmake.js");
const pdfFontsX = require("pdfmake-unicode/dist/pdfmake-unicode.js");
pdfMakeX.vfs = pdfFontsX.pdfMake.vfs;
const pdfMake = __importStar(require("pdfmake/build/pdfmake"));
const fs_1 = require("fs");
// import * as pdfMake from "pdfmake/build/pdfmake";
// import * as pdfFonts from "pdfmake/build/vfs_fonts";
const pdf_generator_1 = require("../utils/pdf-generator");
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
// // Type assertion to let TypeScript know that pdfMake has a vfs property
// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const addOrder = async (req, res, next) => {
    const { address } = req.body;
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    let session;
    try {
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
        console.log("Existing baba user...", existing_user);
        let cart = await (0, cart_repository_1.foundUserCartId)(existing_user.id);
        console.log("My cart...", cart);
        // console.log("My cart. products. .", cart.products);
        if (!cart) {
            return next(new base_error_1.default("Cart not available!", http_status_codes_1.httpStatusCodes.NOT_FOUND));
        }
        let updated_order;
        const created_order = await Order.create({
            userId: existing_user.id,
            address: address,
            totalQty: cart === null || cart === void 0 ? void 0 : cart.totalQty,
            totalPrice: cart === null || cart === void 0 ? void 0 : cart.totalPrice,
        });
        console.log("Created order, id and uuid...", created_order, created_order.id, created_order.uuid);
        const cart_prods = await (0, cart_repository_1.foundCartId)(existing_user.cart.id);
        console.log("This is cart_prods...", cart_prods);
        const products_arr = cart_prods.products.map((item) => {
            console.log("Single item..", item.cart_products);
            return {
                orderId: created_order === null || created_order === void 0 ? void 0 : created_order.id,
                prodId: item.cart_products.productId,
                uuid: created_order === null || created_order === void 0 ? void 0 : created_order.uuid,
                title: item.cart_products.title,
                price: item.cart_products.price,
                quantity: item.cart_products.quantity,
            };
        });
        const paystack_arr = cart_prods.products.map((item) => {
            console.log("Single item..", item.cart_products);
            return {
                name: item.cart_products.title,
                price: item.cart_products.price,
                quantity: item.cart_products.quantity,
            };
        });
        const stripe_arr = cart_prods.products.map((item) => {
            console.log("Single item..", item.cart_products);
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.cart_products.title,
                    },
                    unit_amount: item.cart_products.price * 100,
                },
                quantity: item.cart_products.quantity,
            };
        });
        console.log("Product arrays shit...", products_arr);
        const order_products = await (0, order_repository_1.addCartProds)(products_arr);
        // const file = await generatePDFFile("invoice", created_order);
        // console.log("This is the file content...", file);
        const docDefinition = await (0, pdf_generator_1.generateOrder)(user, created_order, order_products, address);
        console.log("This is it , okay...", docDefinition);
        // Create and open the PDF
        // const pdfDocGenerator = pdfMake.createPdf(docDefinition).open();
        // Retrieve the secret key from the environment variable
        const secretKey = process.env.PAYSTACK_SECRET_KEY;
        // // Configure the paystack module with the secret key
        // const paystackInstance = paystack(secretKey);
        // session = await paystackInstance.transaction.initialize({
        //   email: email,
        //   amount: created_order.totalPrice * 100,
        //   currency: "NGN",
        //   channels: ["card"],
        //   reference: "",
        //   name: "",
        //   metadata: {
        //     products: paystack_arr,
        //   },
        // });
        // console.log("This is my paystack session...", session);
        // Configure the stripe module with the secret key
        const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
        session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: stripe_arr,
            mode: "payment",
            customer_email: email,
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        // Generate and download the PDF
        pdfDocGenerator.getBuffer(async (buffer) => {
            // Save the buffer to a file
            const filePath = `documents/pdf/invoice-${new Date().toISOString()}.pdf`;
            const stream = (0, fs_1.createWriteStream)(filePath);
            stream.write(Buffer.from(buffer));
            stream.end();
            updated_order = await created_order;
            updated_order.pdfLink = filePath;
            await updated_order.save();
            console.log("Updated order yesh", updated_order);
            console.log(`PDF saved to: ${filePath}`);
            console.log("This is updated order with link...", updated_order);
            console.log("This should be url link", 
            // `${req?.hostname}/${updated_order?.pdfLink}`
            `${req.protocol}://${req.get("host")}/${updated_order === null || updated_order === void 0 ? void 0 : updated_order.pdfLink}`);
            // BREVO TYPESCRIPT
            // Initialize the TransactionalEmailsApi instance
            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            // Set your Sendinblue API key
            const apiKey = apiInstance.authentications["apiKey"];
            apiKey.apiKey = process.env.BREVO_API_KEY; // Replace with your API key
            // Create a new instance of SendSmtpEmail to specify email details
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
            // Set the sender details
            sendSmtpEmail.sender = {
                name: "Benkih",
                email: "support@benkih.com",
            };
            // Set the recipient email address
            sendSmtpEmail.to = [{ email }];
            // Set the subject and content of the email
            sendSmtpEmail.subject = "Your order";
            sendSmtpEmail.htmlContent = `
        <h3>Hi,</h3>
        <p>This is your order with an attached file. It's a PDF file.</p>
        <p>Benkih.</p>
      `;
            // If you want to attach a file, set the attachment URL
            // sendSmtpEmail.attachmentUrl = `${req.protocol}://${req.get("host")}/${
            //   updated_order?.pdfLink
            // }`;
            sendSmtpEmail.attachmentUrl = `https://res.cloudinary.com/dymhdpka1/image/upload/v1714244037/peterihimire-logo_whf5lr.png`;
            // Send the email
            apiInstance
                .sendTransacEmail(sendSmtpEmail)
                .then((data) => {
                console.log("Email sent successfully. Response:", data);
                // Handle success
            })
                .catch((error) => {
                console.error("Error sending email:", error);
                // Handle error
                return next(new base_error_1.default(error.response.body.message, http_status_codes_1.httpStatusCodes.INTERNAL_SERVER));
            });
            // //  FOR BREVO
            // let defaultClient = sendinblue_api.ApiClient.instance;
            // // Instantiate the client\
            // let apiKey = defaultClient.authentications["api-key"];
            // apiKey.apiKey = process.env.BREVO_API_KEY;
            // let apiInstance = new sendinblue_api.TransactionalEmailsApi();
            // const sender = {
            //   email: "noreply@benkih.com",
            // };
            // const receivers = [
            //   {
            //     email: email,
            //   },
            // ];
            // apiInstance
            //   .sendTransacEmail({
            //     sender,
            //     to: receivers,
            //     subject: "Order",
            //     attachmentUrl: `https://res.cloudinary.com/dymhdpka1/image/upload/v1714244037/peterihimire-logo_whf5lr.png`,
            //     htmlContent: `
            //   <h3>Hi,</h3>
            //   <p>This is your order with attached file.Its a pdf file.</p>
            //   <p>Benkih.</p>
            // `,
            //     textContent: `
            // Hi,
            // This is your order with attached file, yes!
            // It a pdf file.
            // Benkih.
            // `,
            //   })
            //   .catch((error: any) => {
            //     console.log("This is error: ", error);
            //     return next(
            //       new BaseError(
            //         error.response.body.message,
            //         httpStatusCodes.INTERNAL_SERVER
            //       )
            //     );
            //   });
            // Returned response
            res.status(201).json({
                status: "success",
                msg: "Available Cart Order!",
                data: {
                    // order: created_order,
                    order: updated_order,
                    products: order_products,
                    session: session,
                },
            });
        });
        pdfDocGenerator.download("pdfmake.pdf");
    }
    catch (error) {
        next(error);
    }
};
exports.addOrder = addOrder;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getOrder = async (req, res, next) => {
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const { order_id } = req === null || req === void 0 ? void 0 : req.body;
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
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
        console.log("This is found user & order....", existing_user, existing_order);
        // console.log("cartId....", existing_user.order.id);
        if (!existing_order) {
            return next(new base_error_1.default("Order does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Order info.",
            data: existing_order,
            // data: cart_response,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getOrder = getOrder;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const getOrders = async (req, res, next) => {
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
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
        console.log("This is found user & order....", existing_user, existing_orders);
        // console.log("cartId....", existing_user.order.id);
        if (!existing_orders) {
            return next(new base_error_1.default("Order does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: "Order info.",
            data: existing_orders,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.getOrders = getOrders;
// @route POST api/auth/login
// @desc Login into account
// @access Private
const cancelOrder = async (req, res, next) => {
    const { user } = req === null || req === void 0 ? void 0 : req.session;
    const { order_id } = req.body;
    const status = "cancelled";
    const email = user === null || user === void 0 ? void 0 : user.email;
    try {
        if (email === undefined) {
            return next(new base_error_1.default("Account does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const existing_user = await (0, user_repository_1.foundUser)(email);
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
            return next(new base_error_1.default("Order does not exist!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        if ((existing_order[0].status = status)) {
            return next(new base_error_1.default("Order already cancelled!", http_status_codes_1.httpStatusCodes.CONFLICT));
        }
        const updated_order = await existing_order[0];
        console.log("Updated order yesh", updated_order);
        updated_order.status = status;
        await updated_order.save();
        res.status(http_status_codes_1.httpStatusCodes.OK).json({
            status: "success",
            msg: `Order with id ${order_id} canceled.`,
            data: updated_order,
        });
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.cancelOrder = cancelOrder;
// pdfDocGenerator.getBase64((dataUrl) => {
//   res.writeHead(200, {
//     "Content-Type": "application/pdf",
//     "Content-Disposition": `attachment;filename=invoice.pdf`,
//   });
//   const download = Buffer.from(dataUrl.split("base64,")[1], "base64");
//   console.log("This is download...",download)
//   res.end(download);
// });
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
