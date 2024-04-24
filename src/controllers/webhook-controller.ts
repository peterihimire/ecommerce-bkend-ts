import { RequestHandler } from "express";
import { httpStatusCodes } from "../utils/http-status-codes";
import BaseError from "../utils/base-error";
import crypto from "crypto";
import Stripe from "stripe";
import db from "../database/models";
const User = db.User;
const Transaction = db.Transaction;
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const secret: string = process.env.PAYSTACK_SECRET_KEY!; //using !, tells TS, that secret will always be defined.

require("dotenv").config();

// @route PATCH api/plans/add
// @desc To add plan to an business
// @access Private
export const paystack_webhook: RequestHandler = async (req, res, next) => {
  try {
    //validate event
    const hash = crypto
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
          console.log(
            "This is the well parsed object data...",
            checkout_object
          );

          // const existing_user = await User.findOne({
          //   where: { email: checkout_object.customer.email },
          // });

          if (!existing_user) {
            return next(
              new BaseError(
                `User with the email ${checkout_object.customer.email} does not exist.`,
                httpStatusCodes.NOT_FOUND
              )
            );
          }

          const existing_wallet = await existing_user.getWallet();

          if (!existing_wallet) {
            return next(
              new BaseError(
                `User does not have a wallet!`,
                httpStatusCodes.BAD_REQUEST
              )
            );
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
            payment_status:
              checkout_object.status === "success" ? "successful" : "failed",
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
          console.log(
            "This is the well parsed failed object data...",
            checkout_object
          );

          if (!existing_user) {
            return next(
              new BaseError(
                `User with the email ${checkout_object.customer.email} does not exist.`,
                httpStatusCodes.NOT_FOUND
              )
            );
          }

          const found_wallet = await existing_user.getWallet();

          if (!found_wallet) {
            return next(
              new BaseError(
                `User does not have a wallet!`,
                httpStatusCodes.BAD_REQUEST
              )
            );
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
            payment_status:
              checkout_object.status === "success" ? "successful" : "failed",
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
      res.status(httpStatusCodes.OK).json({
        status: "success",
        msg: "Paystack webhooked YESSSS",
      });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = httpStatusCodes.INTERNAL_SERVER;
    }
    next(error);
  }
};

// @route PATCH api/plans/add
// @desc To add plan to an business
// @access Private
export const stripe_webhook: RequestHandler = async (req, res, next) => {
  const sig: string | string[] | undefined = req?.headers["stripe-signature"];
  const param: string | string[] | Buffer = sig as string | string[]; // Type assertion

  // Now you can safely pass `param` to a function expecting a `string`, a `string[]`, or a `Buffer`

  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event = req.body;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, param, endpointSecret); //check param data
    }

    console.log(
      "This is the event body coming from the plan section...",
      event
    );
    console.log("Param data...", param);
  } catch (err: any) {
    return next(
      new BaseError(
        `Webhook Peter Error : ${err.message}`,
        httpStatusCodes.NOT_FOUND
      )
    );
    // return;
  }
  console.log(
    "This is the event body coming from the webhook section...",
    event
  );
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
        return next(
          new BaseError(
            `User with the email ${checkout_object.customer_email} does not exist.`,
            httpStatusCodes.NOT_FOUND
          )
        );
      }

      const existing_wallet = await existing_user.getWallet();
      if (!existing_wallet) {
        return next(
          new BaseError(
            `User does not have a wallet!`,
            httpStatusCodes.BAD_REQUEST
          )
        );
      }

      await stripe.checkout.sessions.listLineItems(checkout_object.id);
      async (err: any, line_items: any) => {
        console.log(line_items);
        if (err) {
          return next(
            new BaseError(
              `Error occured during process!`,
              httpStatusCodes.BAD_REQUEST
            )
          );
        }

        const updated_wallet = await existing_wallet;
        updated_wallet.transaction_id = checkout_object.id;
        updated_wallet.balance =
          updated_wallet.balance + checkout_object.amount_total / 100;
        updated_wallet.save();

        await Transaction.create({
          payment_method: checkout_object.payment_method_types[0],
          transaction_reference: checkout_object.payment_intent,
          is_successful:
            checkout_object.payment_status === "paid" ? true : false,
          is_verified: checkout_object.status === "complete" ? true : false,
          amount: checkout_object.amount_total / 100,
          currency: checkout_object.currency.toUpperCase(),
          payment_status:
            checkout_object.payment_status === "paid" ? "successful" : "failed",
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
        return next(
          new BaseError(
            `User with the email ${checkout_object.customer_email} does not exist.`,
            httpStatusCodes.NOT_FOUND
          )
        );
      }

      const found_wallet = await existing_user.getWallet();
      if (!found_wallet) {
        return next(
          new BaseError(
            `User does not have a wallet!`,
            httpStatusCodes.BAD_REQUEST
          )
        );
      }

      await stripe.checkout.sessions.listLineItems(checkout_object.id);
      async (err: any, line_items: any) => {
        console.log(line_items);
        if (err) {
          return next(
            new BaseError(
              `Error occured during process!`,
              httpStatusCodes.BAD_REQUEST
            )
          );
        }

        const updated_wallet = await found_wallet;
        updated_wallet.transaction_id = checkout_object.id;
        updated_wallet.balance =
          updated_wallet.balance + checkout_object.amount_total / 100;
        updated_wallet.save();

        await Transaction.create({
          payment_method: checkout_object.payment_method_types[0],
          transaction_reference: checkout_object.payment_intent,
          is_successful:
            checkout_object.payment_status === "paid" ? true : false,
          is_verified: checkout_object.status === "complete" ? true : false,
          amount: checkout_object.amount_total / 100,
          currency: checkout_object.currency.toUpperCase(),
          payment_status:
            checkout_object.payment_status === "paid" ? "successful" : "failed",
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

  res.status(httpStatusCodes.OK).json({
    status: "success",
    msg: "Stripe webhooked YESSSS",
  });
};
