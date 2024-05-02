import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  getInitialContactsWithMessages,
  getMessages,
  scheduleMessage,
} from "../controllers/MessageController.js";
import multer from "multer";

const uploadImage = multer({ dest: "uploads/images" });
const uploadAudio = multer({ dest: "uploads/recordings" });

const router = Router();
router.post("/add-message", addMessage);
router.get("/get-messages/:from/:to/:userLanguage", getMessages);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);
router.get("/get-initial-contacts/:from", getInitialContactsWithMessages);
router.post("/schedule-message", scheduleMessage);


export default router;
