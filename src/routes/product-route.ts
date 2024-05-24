import { Router } from "express";
import {
  addProduct,
  editProduct,
  getProducts,
  deleteProduct,
  getProduct,
  getProductsFilter,
} from "../controllers/product-controller";
import { verifySessionAdmin } from "../middlewares/verify-session";
import { productImages } from "../middlewares/file-upload";
const router = Router();

router.post("/add", productImages, verifySessionAdmin, addProduct);
router.get("/get_products", getProducts);
router.get("/get_products_filter", getProductsFilter);
router.get("/get_product/:prod_id", getProduct);
router.patch(
  "/update/:prod_id",
  productImages,
  verifySessionAdmin,
  editProduct
);
router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);

export default router;
