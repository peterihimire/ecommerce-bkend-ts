"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product-controller");
const verify_session_1 = require("../middlewares/verify-session");
const router = (0, express_1.Router)();
router.post("/add", verify_session_1.verifySessionAdmin, product_controller_1.addProduct);
router.get("/get_products", product_controller_1.getProducts);
router.get("/get_product/:prod_id", product_controller_1.getProduct);
router.patch("/update/:prod_id", verify_session_1.verifySessionAdmin, product_controller_1.editProduct);
router.delete("/delete/:prod_id", verify_session_1.verifySessionAdmin, product_controller_1.deleteProduct);
exports.default = router;