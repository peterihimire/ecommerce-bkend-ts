import { Router } from "express";
import { addCart, addedToCart } from "../controllers/cart-controller";
import { verifySessionAndAuthorization } from "../middlewares/verify-session";
const router = Router();

router.post("/add", verifySessionAndAuthorization, addedToCart);
// router.get("/get_products", getProducts);
// router.get("/get_product/:prod_id", getProduct);
// router.patch("/update/:prod_id", verifySessionAdmin, editProduct);
// router.delete("/delete/:prod_id", verifySessionAdmin, deleteProduct);

export default router;
