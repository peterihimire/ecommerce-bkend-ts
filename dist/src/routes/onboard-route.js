"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const onboard_controller_1 = require("../controllers/onboard-controller");
const router = (0, express_1.Router)();
router.post("/register", onboard_controller_1.register);
router.post("/verify_email", onboard_controller_1.verify_otp);
exports.default = router;
