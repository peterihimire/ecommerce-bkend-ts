import { Router } from "express";
import {
  addCart,
  getCart,
  updateProductQty,
  deleteCartProd,
} from "../controllers/cart-controller";
import {
  // verifySessionAndAuthorization
} from "../middlewares/verify-session";
const router = Router();

router.post("/add",
  // verifySessionAndAuthorization,
  addCart);
router.get("/get_cart",
  // verifySessionAndAuthorization,
  getCart);
// router.get("/get_product/:prod_id", getProduct);
router.patch(
  "/update_prod_qty",
  // verifySessionAndAuthorization,
  updateProductQty
);
router.delete(
  "/delete_cart_prod",
  // verifySessionAndAuthorization,
  deleteCartProd
);

export default router;
