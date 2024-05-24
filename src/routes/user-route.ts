import { Router } from "express";
import {
  uploadPicture,
  updateUser,
  getUserInfo,
} from "../controllers/user-controller";
import { profileImage } from "../middlewares/file-upload";
import {
  isLoggedIn,
  verifySessionAdmin,
  // verifySessionAndAuthorization,
} from "../middlewares/verify-session";
const router = Router();

router.post(
  "/upload/profile_picture",
  profileImage,
  // verifySessionAndAuthorization,
  uploadPicture
);
router.get("/acct_info", isLoggedIn, getUserInfo);
router.patch(
  "/update",
  // verifySessionAndAuthorization,
  updateUser
);
// router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);

export default router;
