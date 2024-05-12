"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe_webhook = exports.paystack_webhook = void 0;
const http_status_codes_1 = require("../utils/http-status-codes");
const base_error_1 = __importDefault(require("../utils/base-error"));
const crypto_1 = __importDefault(require("crypto"));
const stripe_1 = __importDefault(require("stripe"));
const models_1 = __importDefault(require("../database/models"));
const User = models_1.default.User;
const Transaction = models_1.default.Transaction;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
const secret = process.env.PAYSTACK_SECRET_KEY; //using !, tells TS, that secret will always be defined.
require("dotenv").config();
// @route PATCH api/plans/add
// @desc To add plan to an business
// @access Private
const paystack_webhook = async (req, res, next) => {
    try {
        //validate event
        const hash = crypto_1.default
            .createHmac("sha512", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");
        if (hash == req.headers["x-paystack-signature"]) {
            // Retrieve the request's body
            const event = req.body;
            // Do something with event
            const checkout_object = event.data;
            const existing_user = await User.findOne({
                where: { email: checkout_object.customer.email },
            });
            switch (event.event) {
                case "charge.success":
                    // logic
                    console.log("This is the well parsed object data...", checkout_object);
                    // const existing_user = await User.findOne({
                    //   where: { email: checkout_object.customer.email },
                    // });
                    if (!existing_user) {
                        return next(new base_error_1.default(`User with the email ${checkout_object.customer.email} does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
                    }
                    const existing_wallet = await existing_user.getWallet();
                    if (!existing_wallet) {
                        return next(new base_error_1.default(`User does not have a wallet!`, http_status_codes_1.httpStatusCodes.BAD_REQUEST));
                    }
                    const updated_wallet = await existing_wallet;
                    updated_wallet.transaction_id = checkout_object.id;
                    updated_wallet.balance =
                        updated_wallet.balance + checkout_object.amount / 100;
                    updated_wallet.save();
                    console.log("This is updated wallet thing...", updated_wallet);
                    await Transaction.create({
                        payment_method: checkout_object.channel,
                        transaction_reference: checkout_object.reference,
                        is_successful: checkout_object.status === "success" ? true : false,
                        payment_status: checkout_object.status === "success" ? "successful" : "failed",
                        is_verified: checkout_object.status === "success" ? true : false,
                        amount: checkout_object.amount / 100,
                        currency: checkout_object.currency.toUpperCase(),
                        payment_gateway: "paystack",
                        acct_id: existing_user.acct_id,
                        transaction_id: checkout_object.id,
                        walletId: updated_wallet.id,
                    });
                    break;
                case "charge.failed":
                    // logic
                    console.log("This is the well parsed failed object data...", checkout_object);
                    if (!existing_user) {
                        return next(new base_error_1.default(`User with the email ${checkout_object.customer.email} does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
                    }
                    const found_wallet = await existing_user.getWallet();
                    if (!found_wallet) {
                        return next(new base_error_1.default(`User does not have a wallet!`, http_status_codes_1.httpStatusCodes.BAD_REQUEST));
                    }
                    const edited_wallet = await found_wallet;
                    edited_wallet.transaction_id = checkout_object.id;
                    edited_wallet.balance =
                        edited_wallet.balance + checkout_object.amount / 100;
                    edited_wallet.save();
                    console.log("This is edited wallet thing...", edited_wallet);
                    await Transaction.create({
                        payment_method: checkout_object.channel,
                        transaction_reference: checkout_object.reference,
                        is_successful: checkout_object.status === "success" ? true : false,
                        payment_status: checkout_object.status === "success" ? "successful" : "failed",
                        is_verified: checkout_object.status === "success" ? true : false,
                        amount: checkout_object.amount / 100,
                        currency: checkout_object.currency.toUpperCase(),
                        payment_gateway: "paystack",
                        acct_id: existing_user.acct_id,
                        transaction_id: checkout_object.id,
                        walletId: updated_wallet.id,
                    });
                    break;
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            res.status(http_status_codes_1.httpStatusCodes.OK).json({
                status: "success",
                msg: "Paystack webhooked YESSSS",
            });
        }
    }
    catch (error) {
        if (!error.statusCode) {
            error.statusCode = http_status_codes_1.httpStatusCodes.INTERNAL_SERVER;
        }
        next(error);
    }
};
exports.paystack_webhook = paystack_webhook;
// @route PATCH api/plans/add
// @desc To add plan to an business
// @access Private
const stripe_webhook = async (req, res, next) => {
    const sig = req === null || req === void 0 ? void 0 : req.headers["stripe-signature"];
    const param = sig; // Type assertion
    // Now you can safely pass `param` to a function expecting a `string`, a `string[]`, or a `Buffer`
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let event = req.body;
    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(req.body, param, endpointSecret); //check param data
        }
        console.log("This is the event body coming from the plan section...", event);
        console.log("Param data...", param);
    }
    catch (err) {
        return next(new base_error_1.default(`Webhook Peter Error : ${err.message}`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
        // return;
    }
    console.log("This is the event body coming from the webhook section...", event);
    const checkout_object = event.data.object;
    // USER CHECK
    const existing_user = await User.findOne({
        where: { email: checkout_object.customer_email },
    });
    // Handle the event
    switch (event.type) {
        case "checkout.session.completed":
            console.log("This is the well parsed object data...", checkout_object);
            // const existing_user = await User.findOne({
            //   where: { email: checkout_object.customer_email },
            // });
            if (!existing_user) {
                return next(new base_error_1.default(`User with the email ${checkout_object.customer_email} does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
            }
            const existing_wallet = await existing_user.getWallet();
            if (!existing_wallet) {
                return next(new base_error_1.default(`User does not have a wallet!`, http_status_codes_1.httpStatusCodes.BAD_REQUEST));
            }
            await stripe.checkout.sessions.listLineItems(checkout_object.id);
            async (err, line_items) => {
                console.log(line_items);
                if (err) {
                    return next(new base_error_1.default(`Error occured during process!`, http_status_codes_1.httpStatusCodes.BAD_REQUEST));
                }
                const updated_wallet = await existing_wallet;
                updated_wallet.transaction_id = checkout_object.id;
                updated_wallet.balance =
                    updated_wallet.balance + checkout_object.amount_total / 100;
                updated_wallet.save();
                await Transaction.create({
                    payment_method: checkout_object.payment_method_types[0],
                    transaction_reference: checkout_object.payment_intent,
                    is_successful: checkout_object.payment_status === "paid" ? true : false,
                    is_verified: checkout_object.status === "complete" ? true : false,
                    amount: checkout_object.amount_total / 100,
                    currency: checkout_object.currency.toUpperCase(),
                    payment_status: checkout_object.payment_status === "paid" ? "successful" : "failed",
                    payment_gateway: "stripe",
                    acct_id: existing_user.acct_id,
                    transaction_id: checkout_object.id,
                    walletId: updated_wallet.id,
                });
            };
            break;
        case "payment_intent.payment_failed":
            console.log("This is the well parsed object data...", checkout_object);
            // const existing_user = await User.findOne({
            //   where: { email: checkout_object.customer_email },
            // });
            if (!existing_user) {
                return next(new base_error_1.default(`User with the email ${checkout_object.customer_email} does not exist.`, http_status_codes_1.httpStatusCodes.NOT_FOUND));
            }
            const found_wallet = await existing_user.getWallet();
            if (!found_wallet) {
                return next(new base_error_1.default(`User does not have a wallet!`, http_status_codes_1.httpStatusCodes.BAD_REQUEST));
            }
            await stripe.checkout.sessions.listLineItems(checkout_object.id);
            async (err, line_items) => {
                console.log(line_items);
                if (err) {
                    return next(new base_error_1.default(`Error occured during process!`, http_status_codes_1.httpStatusCodes.BAD_REQUEST));
                }
                const updated_wallet = await found_wallet;
                updated_wallet.transaction_id = checkout_object.id;
                updated_wallet.balance =
                    updated_wallet.balance + checkout_object.amount_total / 100;
                updated_wallet.save();
                await Transaction.create({
                    payment_method: checkout_object.payment_method_types[0],
                    transaction_reference: checkout_object.payment_intent,
                    is_successful: checkout_object.payment_status === "paid" ? true : false,
                    is_verified: checkout_object.status === "complete" ? true : false,
                    amount: checkout_object.amount_total / 100,
                    currency: checkout_object.currency.toUpperCase(),
                    payment_status: checkout_object.payment_status === "paid" ? "successful" : "failed",
                    payment_gateway: "stripe",
                    acct_id: existing_user.acct_id,
                    transaction_id: checkout_object.id,
                    walletId: updated_wallet.id,
                });
            };
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
    res.status(http_status_codes_1.httpStatusCodes.OK).json({
        status: "success",
        msg: "Stripe webhooked YESSSS",
    });
};
exports.stripe_webhook = stripe_webhook;
