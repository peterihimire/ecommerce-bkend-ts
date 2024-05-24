import { Router } from "express";
import { login, logout } from "../controllers/auth-controller";
import {
  local_authenticate,
  google_authenticate,
google_callback
} from '../middlewares/passport-authenticate'
const router = Router();

// router.post("/login", login);
router.post("/login", local_authenticate, login);
router.get("/google", google_authenticate);
router.get("/google/callback", google_callback);
router.post("/logout", logout);

export default router;
