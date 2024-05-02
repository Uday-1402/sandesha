import { Router } from "express";
import {
  translateFront,
  updateLanguage
} from "../controllers/AWSTranslateController.js";

const router = Router();
router.post("/", translateFront);
router.post("/update-language", updateLanguage);

export default router;
