import { Router } from "express";
import { uploadPicture } from "../controllers/user-controller";
import { profileImage } from "../middlewares/file-upload";
import {
  verifySessionAdmin,
  verifySessionAndAuthorization,
} from "../middlewares/verify-session";
const router = Router();

router.post(
  "/upload/profile_picture",
  profileImage,
  verifySessionAndAuthorization,
  uploadPicture
);
// router.get("/get_products", getProducts);
// router.get("/get_product/:prod_id", getProduct);
// router.patch("/update/:prod_id", verifySessionAdmin, editProduct);
// router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);

export default router;
