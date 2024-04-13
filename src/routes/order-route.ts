import { Router } from "express";
import {
  addOrder,
  getOrder,
  getOrders,
  cancelOrder,
} from "../controllers/order-controller";
import { verifySessionAndAuthorization } from "../middlewares/verify-session";
const router = Router();

router.post("/add", verifySessionAndAuthorization, addOrder);
router.get("/get_order", verifySessionAndAuthorization, getOrder);
router.get("/get_orders", getOrders);
router.patch("/cancel_order", verifySessionAndAuthorization, cancelOrder);
// router.delete(
//   "/delete_cart_prod",
//   verifySessionAndAuthorization,
//   deleteCartProd
// );

export default router;
