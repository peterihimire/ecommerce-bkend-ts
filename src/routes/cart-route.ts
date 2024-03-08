import { Router } from "express";
import { addCart, getCart } from "../controllers/cart-controller";
import { verifySessionAndAuthorization } from "../middlewares/verify-session";
const router = Router();

router.post("/add", verifySessionAndAuthorization, addCart);
router.get("/get_cart", verifySessionAndAuthorization, getCart);
// router.get("/get_product/:prod_id", getProduct);
// router.patch("/update/:prod_id", verifySessionAdmin, editProduct);
// router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);

export default router;
