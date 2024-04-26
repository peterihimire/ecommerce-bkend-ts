import { Router } from "express";
import { register, verify_otp } from "../controllers/onboard-controller";
const router = Router();

router.post("/register", register);
router.post("/verify_email", verify_otp);


export default router;
