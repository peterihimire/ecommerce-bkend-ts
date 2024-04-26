import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  editCategory,
  getCategories,
  getCategory,
} from "../controllers/category-controller";
import { verifySessionAdmin } from "../middlewares/verify-session";
const router = Router();

router.post("/add", verifySessionAdmin, addCategory);
router.get("/get_categories", getCategories);
router.get("/get_category/:cat_id", getCategory);
router.patch("/update/:cat_id", verifySessionAdmin, editCategory);
router.delete("/delete/:cat_id", verifySessionAdmin, deleteCategory);

export default router;
