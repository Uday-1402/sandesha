import { Router } from "express";
import {
  checkUser,
  getAllUsers,
  onBoardUser,
  test,
} from "../controllers/AuthController.js";

const router = Router();
router.get("/test", test);
router.post("/check-user", checkUser);
router.post("/onboard-user", onBoardUser);
router.get("/get-contacts", getAllUsers);

export default router;
