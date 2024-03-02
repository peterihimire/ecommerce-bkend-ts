import { Router } from "express";
import { addProduct } from "../controllers/product-controller";
import { verifySessionAdmin } from "../middlewares/verify-session";
const router = Router();

router.post("/add", verifySessionAdmin, addProduct);
// router.post("/login", login);

export default router;
