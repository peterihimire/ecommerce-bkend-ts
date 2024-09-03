import { Router } from "express";
import {
  addCart,
  addCartQty,
  getCart,
  updateProductQty,
  deleteCartProd,
  updateCartProdQty,
  clearCart,
} from "../controllers/cart-controller";
import { isLoggedIn } from "../middlewares/verify-session";
const router = Router();

router.post("/add", isLoggedIn, addCart);
router.post("/add-qty", isLoggedIn, addCartQty);
router.get("/get_cart", isLoggedIn, getCart);
router.patch("/update_prod_qty", isLoggedIn, updateProductQty);
router.patch("/update-cart-product", isLoggedIn, updateCartProdQty);
router.delete("/delete_cart_prod/:prod_id", isLoggedIn, deleteCartProd);
router.patch("/clear-cart", isLoggedIn, clearCart);

export default router;
