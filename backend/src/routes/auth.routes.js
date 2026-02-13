import { Router } from "express";
import { loginController, meController, updateMeController, forgotPasswordController, uploadProfileImageController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { profileUploadMiddleware } from "../middlewares/profileUpload.middleware.js";

const router = Router();

// Login
router.post("/login", loginController);

// Forgot Password
router.post("/forgot-password", forgotPasswordController);

// Current logged-in user
router.get("/getUser", authMiddleware, meController);
router.put("/profile", authMiddleware, updateMeController);
router.post("/upload-profile-image", authMiddleware, profileUploadMiddleware.single("profileImage"), uploadProfileImageController);

export default router;