import { Router } from "express";
import {
  addOrder,
  getOrder,
  getOrders,
  cancelOrder,
} from "../controllers/order-controller";
import {
  isLoggedIn,
  // verifySessionAndAuthorization
} from "../middlewares/verify-session";
const router = Router();

router.post(
  "/add",
  isLoggedIn,
  // verifySessionAndAuthorization,
  addOrder
);
router.get(
  "/get_order",
  isLoggedIn,
  // verifySessionAndAuthorization,
  getOrder
);
router.get("/get_orders", getOrders);
router.patch(
  "/cancel_order",
  isLoggedIn,
  // verifySessionAndAuthorization,
  cancelOrder
);
// router.delete(
//   "/delete_cart_prod",
//   verifySessionAndAuthorization,
//   deleteCartProd
// );

export default router;
