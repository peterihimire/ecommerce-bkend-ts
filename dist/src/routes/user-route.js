"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user-controller");
const file_upload_1 = require("../middlewares/file-upload");
const verify_session_1 = require("../middlewares/verify-session");
const router = (0, express_1.Router)();
router.post("/upload/profile_picture", file_upload_1.profileImage, verify_session_1.verifySessionAndAuthorization, user_controller_1.uploadPicture);
router.get("/acct_info", user_controller_1.getUserInfo);
router.patch("/update", verify_session_1.verifySessionAndAuthorization, user_controller_1.updateUser);
// router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);
exports.default = router;
