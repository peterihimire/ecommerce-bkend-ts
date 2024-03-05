import { Router } from "express";
import {
  addProduct,
  editProduct,
  getProducts,
  deleteProduct,
  getProduct,
} from "../controllers/product-controller";
import { verifySessionAdmin } from "../middlewares/verify-session";
const router = Router();

router.post("/add", verifySessionAdmin, addProduct);
router.get("/get_products", getProducts);
router.get("/get_product/:prod_id", getProduct);
router.patch("/update/:prod_id", verifySessionAdmin, editProduct);
router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);

export default router;
