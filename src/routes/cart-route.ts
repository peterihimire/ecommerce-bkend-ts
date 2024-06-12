import { Router } from "express";
import {
  addCart,
  getCart,
  updateProductQty,
  deleteCartProd,
} from "../controllers/cart-controller";
import {
  isLoggedIn,
  // verifySessionAndAuthorization
} from "../middlewares/verify-session";
const router = Router();

router.post(
  "/add",isLoggedIn,
  // verifySessionAndAuthorization,
  addCart
);
router.get(
  "/get_cart",isLoggedIn,
  // verifySessionAndAuthorization,
  getCart
);
// router.get("/get_product/:prod_id", getProduct);
router.patch(
  "/update_prod_qty",isLoggedIn,
  // verifySessionAndAuthorization,
  updateProductQty
);
router.delete(
  "/delete_cart_prod",isLoggedIn,
  // verifySessionAndAuthorization,
  deleteCartProd
);

export default router;
