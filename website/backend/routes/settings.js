import express from "express";
import { updateProfile, updatePassword, getSettings, updateNotifications, updateStorage } from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All settings routes require authentication
router.use(protect);

// Get user settings
router.get("/", getSettings);

// Update profile settings (username, email)
router.put("/profile", updateProfile);

// Update password
router.put("/password", updatePassword);

// Update notification preferences
router.put("/notifications", updateNotifications);

// Update storage settings
router.put("/storage", updateStorage);

export default router;
