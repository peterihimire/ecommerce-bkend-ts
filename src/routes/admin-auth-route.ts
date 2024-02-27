import { Router } from "express";
import { register } from "../controllers/admin-auth-controller";
const router = Router();

router.post("/register", register);
// router.post("/login", login);

export default router;
