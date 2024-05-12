"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order-controller");
const verify_session_1 = require("../middlewares/verify-session");
const router = (0, express_1.Router)();
router.post("/add", verify_session_1.verifySessionAndAuthorization, order_controller_1.addOrder);
router.get("/get_order", verify_session_1.verifySessionAndAuthorization, order_controller_1.getOrder);
router.get("/get_orders", order_controller_1.getOrders);
router.patch("/cancel_order", verify_session_1.verifySessionAndAuthorization, order_controller_1.cancelOrder);
// router.delete(
//   "/delete_cart_prod",
//   verifySessionAndAuthorization,
//   deleteCartProd
// );
exports.default = router;
