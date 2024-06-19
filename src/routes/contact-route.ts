import { Router } from "express";
import {
  addContact,
  getAllContacts,
  getContact,
  deleteContact,
} from "../controllers/contact-controller";
import { verifySessionAdmin } from "../middlewares/verify-session";
const router = Router();

router.post("/add", addContact);
router.get("/get_contacts", getAllContacts);
router.get("/get_contact/:cId", getContact);
// router.patch("/update/:cat_id", verifySessionAdmin, editCategory);
router.delete("/delete/:cId", verifySessionAdmin, deleteContact);

export default router;
