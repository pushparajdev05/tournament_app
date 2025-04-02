import { Router, Request, Response } from "express";
import { z } from "zod"; // Import Zod for validation
import {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    forgotPassword,
    resetPasswordHandler,
    confirmResetPasswordHandler,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth/auth.middleware";
import { validateUserProfile, validatePasswordReset } from "../middlewares/auth/validation.middleware";

const authRoutes = Router();

const registerSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

authRoutes.post("/register", async (req: Request, res: Response) => {
    try {
        const parsedData = registerSchema.parse(req.body);
        const { username, email, password } = parsedData;
        const newUser = await register(username, email, password);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: error.errors });
        } else {
            res.status(500).json({ error: "Internal server error" });
        }
    }
});

authRoutes.post("/login", login);
authRoutes.get("/profile", authMiddleware, getUserProfile);
authRoutes.put("/profile", authMiddleware, validateUserProfile, updateUserProfile);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", validatePasswordReset, resetPasswordHandler);
authRoutes.put("/reset-password/:token", validatePasswordReset, confirmResetPasswordHandler);

authRoutes.get("/welcome", (req: Request, res: Response) => {
    res.status(200).json({ message: "Welcome to the AarbhitX API!" });
});

export default authRoutes;