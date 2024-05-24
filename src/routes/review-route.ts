import { Router } from "express";
import {
  addReview,
  getReview,
  getReviews,
  deleteReview,
} from "../controllers/review-controller";
import {
  verifySessionAdmin,
  // verifySessionAndAuthorization,
} from "../middlewares/verify-session";
const router = Router();

router.post("/add",
  // verifySessionAndAuthorization,
  addReview);
router.get("/get_reviews", getReviews);
router.get("/get_review/:rev_id", getReview);
// router.patch("/update/:cat_id", verifySessionAdmin, editCategory);
router.delete("/delete/:rev_id",
  // verifySessionAndAuthorization,
  deleteReview);

export default router;
