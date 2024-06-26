"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("../controllers/cart-controller");
const verify_session_1 = require("../middlewares/verify-session");
const router = (0, express_1.Router)();
router.post("/add", verify_session_1.verifySessionAndAuthorization, cart_controller_1.addCart);
router.get("/get_cart", verify_session_1.verifySessionAndAuthorization, cart_controller_1.getCart);
// router.get("/get_product/:prod_id", getProduct);
router.patch("/update_prod_qty", verify_session_1.verifySessionAndAuthorization, cart_controller_1.updateProductQty);
router.delete("/delete_cart_prod", verify_session_1.verifySessionAndAuthorization, cart_controller_1.deleteCartProd);
exports.default = router;
