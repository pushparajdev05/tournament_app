import { Router, Request, Response } from "express";
import { z } from "zod"; // Import Zod for validation
import { registerUser, login, getUserProfile, updateUserProfile, resetPasswordHandler, confirmResetPasswordHandler } from "@/controllers/auth.controller";

import { authMiddleware } from "@/middlewares/auth/auth.middleware";
import { validateEmailOnly,validateRegister, validateUserProfile, validatePasswordReset } from "@/middlewares/auth/validation.middleware";

//create a router object for authentication of user
const authRoutes = Router();
//registeration router
authRoutes.post("/register", validateRegister, registerUser);

//User login router
authRoutes.post("/login", login);

//get user profile router
authRoutes.get("/profile", authMiddleware, getUserProfile);

//update user profile router
authRoutes.put("/profile", authMiddleware, validateUserProfile, updateUserProfile);

//forgot password router that will the verification link to user Email
authRoutes.post("/forgot-password", validateEmailOnly, resetPasswordHandler);

//reset password router that will verify the user with token and date of expries
authRoutes.put("/reset-password/:token", validatePasswordReset, confirmResetPasswordHandler);

export default authRoutes;