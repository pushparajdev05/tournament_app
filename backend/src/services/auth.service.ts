import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { transporter } from "../config/email"; // Extracted transporter setup
import { logger } from "@/server"; // Importing the logger
import { ServiceResponse,failed } from "@/utils/httpHandlers";
import { env } from "@/config/envConfig";
import { StatusCodes } from "http-status-codes";

const SECRET_KEY = env.JWT_SECRET as string;

//  User Registration
export const register = async ( username: string,email: string, password: string) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);     
        const user= await User.create({  username,email, password: hashedPassword });
        
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
        logger.info("Token generated for user:", { userId: user._id, token }); // Logging token generation
        return ServiceResponse.success("User registered successfully",{user, token},StatusCodes.CREATED);
    } catch (error) {
        logger.error("Error in register:", error); // Logging the error
        return failed("User registeration failed ",StatusCodes.INTERNAL_SERVER_ERROR);

    }
};

//  User Login
export const loginUser = async (email: string, password: string) => {
    try {
        if (!email || !password)
            return failed("Email and password are required for login",StatusCodes.BAD_REQUEST);

        const user = await User.findOne({ email }).select("+password");
        if (!user)
            return failed("User not found",StatusCodes.UNAUTHORIZED);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
        return failed("Invalid Credential",StatusCodes.FORBIDDEN);
            
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

        logger.info("Token generated for user:", { userId: user._id, token }); // Logging token generation
        return ServiceResponse.success("User logined successfully", { user, token }, StatusCodes.OK);
        
    } catch (error) {
        logger.error("Error in loginUser:", error); // Logging the error
        return failed("User failed to login  ",StatusCodes.FORBIDDEN);
    }
};

//  Get User Profile
export const getUser = async (userId: string | undefined) => {
    try {
        const user = await User.findById(userId).select("-password");
        if (!user)
            return failed("User not found",StatusCodes.NOT_FOUND);

        return ServiceResponse.success("user successfully retrieved",user,StatusCodes.OK);
    } catch (error) {
        logger.error("Error in getUserProfile:", error); // Logging the error
        return failed("server failed to find user",StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
};

//  Update User Profile
export const updateUserProfile = async (userId: string | undefined, updateData: any) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select("-password");       
        if (!updatedUser)
            return failed("User not found",StatusCodes.NOT_FOUND);
        return ServiceResponse.success("user successfully updated",updatedUser,StatusCodes.OK);
    } catch (error) {
        logger.error("Error in updateUserProfile:", error); // Logging the error
        return failed("server failed to update the user",StatusCodes.INTERNAL_SERVER_ERROR);
        
    }
};

//  Reset Password - Request Reset
export const resetPassword = async (email: string) => {
    try {
        const user = await User.findOne({ email });
        if (!user)
            return failed("User not found", StatusCodes.NOT_FOUND);

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

        return ServiceResponse.success("Password reset email sent successfully",null,StatusCodes.OK);
    } catch (error) {
        logger.error("Error in resetPassword:", error); // Logging the error
        return failed("Server failed to sent verification mail",StatusCodes.INTERNAL_SERVER_ERROR);

    }
};

//  Confirm Password Reset
export const confirmResetPassword = async (token: string, newPassword: string) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: { $exists: true },
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user)
            return failed("Invalid or expired reset token",StatusCodes.BAD_REQUEST);


        const isMatch = await bcrypt.compare(token, user.resetPasswordToken ?? "");
        if (!isMatch)
            return failed("Invalid reset token",StatusCodes.UNAUTHORIZED);

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();


        return ServiceResponse.success("Password reset successful",null,StatusCodes.CREATED);
    } catch (error) {
        logger.error("Error in confirmResetPassword:", error); // Logging the error
        return failed("Server failed to reset password",StatusCodes.INTERNAL_SERVER_ERROR);

    }
};

