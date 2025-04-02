import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { transporter } from "./email"; // Extracted transporter setup
import logger from "../config/logger"; // Importing the logger

const SECRET_KEY = process.env.JWT_SECRET as string;

//  User Registration
export const register = async ( username: string,email: string, password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);     
        const user = await User.create({  username,email, password: hashedPassword });
        
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
        logger.info("Token generated for user:", { userId: user._id, token }); // Logging token generation
        return { user, token };
    } catch (error) {
        logger.error("Error in register:", error); // Logging the error
        throw new Error("Registration failed");
    }
};

//  User Login
export const loginUser = async (email: string, password: string) => {
    try {
        if (!email || !password) throw new Error("Email and password are required for login");

        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
        logger.info("Token generated for user:", { userId: user._id, token }); // Logging token generation
        return { user, token };
    } catch (error) {
        logger.error("Error in loginUser:", error); // Logging the error
        throw error;
    }
};

//  Get User Profile
export const getUserProfile = async (userId: string) => {
    try {
        const user = await User.findById(userId).select("-password");
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        logger.error("Error in getUserProfile:", error); // Logging the error
        throw error;
    }
};

//  Update User Profile
export const updateUserProfile = async (userId: string, updateData: any) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) throw new Error("User not found");
        return updatedUser;
    } catch (error) {
        logger.error("Error in updateUserProfile:", error); // Logging the error
        throw error;
    }
};

//  Reset Password - Request Reset
export const resetPassword = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found");

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

        await transporter.sendMail({
            from: `"Support Team" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click the link below to reset your password:</p>
                   <a href="${resetLink}">${resetLink}</a>
                   <p>This link will expire in 1 hour.</p>`,
        });

        return { message: "Password reset email sent successfully" };
    } catch (error) {
        logger.error("Error in resetPassword:", error); // Logging the error
        throw error;
    }
};

//  Confirm Password Reset
export const confirmResetPassword = async (token: string, newPassword: string) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) throw new Error("Invalid or expired reset token");

        const isMatch = await bcrypt.compare(token, user.resetPasswordToken ?? "");
        if (!isMatch) throw new Error("Invalid reset token");

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: "Password reset successful" };
    } catch (error) {
        logger.error("Error in confirmResetPassword:", error); // Logging the error
        throw error;
    }
};
